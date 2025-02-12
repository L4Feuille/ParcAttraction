from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

import os
import request.request as req
import controller.auth.auth as user
import controller.attraction as attraction

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    """ Vérifie si le fichier a une extension autorisée """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def hello_world():
    return 'Hello, Docker!'

# Attraction
@app.post('/attraction')
def addAttraction():
    print("okok", flush=True)
    # Fonction vérif token
    checkToken = user.check_token(request)
    if (checkToken != True):
        return checkToken

    json = request.get_json()
    retour = attraction.add_attraction(json)
    if (retour):
        return jsonify({"message": "Element ajouté.", "result": retour}), 200
    return jsonify({"message": "Erreur lors de l'ajout.", "result": retour}), 500

@app.get('/attraction')
def getAllAttraction():
    """ Récupère toutes les attractions avec leurs images associées """
    attractions = attraction.get_all_attraction()

    for a in attractions:
        a["images"] = req.select_from_db("SELECT image_url FROM images WHERE attraction_id = ?", (a["attraction_id"],))
    
    return jsonify(attractions), 200

@app.get('/attraction/<int:index>')
def getAttraction(index):
    result = attraction.get_attraction(index)
    return result, 200

@app.delete('/attraction/<int:index>')
def deleteAttraction(index):
    
    checkToken = user.check_token(request)
    if checkToken != True:
        return checkToken
    
    req.delete_from_db("DELETE FROM images WHERE attraction_id = ?", (index,))
    
    if attraction.delete_attraction(index):
        return "Attraction supprimée avec succès.", 200
    return jsonify({"message": "Erreur lors de la suppression de l'attraction."}), 500


@app.post('/login')
def login():
    json = request.get_json()

    if (not 'name' in json or not 'password' in json):
        result = jsonify({'messages': ["Nom ou/et mot de passe incorrect"]})
        return result, 400
    
    cur, conn = req.get_db_connection()
    requete = f"SELECT * FROM users WHERE name = '{json['name']}' AND password = '{json['password']}';"
    cur.execute(requete)
    records = cur.fetchall()
    conn.close()

    result = jsonify({"token": user.encode_auth_token(list(records[0])[0]), "name": json['name']})
    return result, 200

@app.post('/upload/<int:attraction_id>')
def upload_file(attraction_id):
    """ Upload plusieurs images pour une attraction """
    if 'file' not in request.files:
        return jsonify({"message": "Aucun fichier envoyé"}), 400

    files = request.files.getlist('file')
    image_urls = []

    for file in files:
        if file.filename == '':
            continue
        
        if file and allowed_file(file.filename):
            filename = secure_filename(f"{attraction_id}_{file.filename}")
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

            # Enregistrer l'image en base de données
            image_url = f"/images/{filename}"
            req.insert_in_db("INSERT INTO images (attraction_id, image_url) VALUES (?, ?)", (attraction_id, image_url))
            image_urls.append(image_url)

    return jsonify({"message": "Images uploadées", "image_urls": image_urls}), 200

@app.get('/attraction/<int:attraction_id>/images')
def get_images(attraction_id):
    """ Récupère toutes les images d’une attraction """
    images = req.select_from_db("SELECT image_url FROM images WHERE attraction_id = ?", (attraction_id,))
    return jsonify(images), 200


@app.get('/images/<filename>')
def get_image(filename):
    """ Permet de récupérer une image """
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# ---------- EXÉCUTION ---------- #
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)