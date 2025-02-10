import request.request as req

def add_attraction(data):
    """ Ajoute une attraction avec une image optionnelle """
    if not all(k in data for k in ["nom", "localisation", "constructeur", "modele", "classement"]):
        return False

    data.setdefault("visible", True)
    data.setdefault("image_url", "")

    if "attraction_id" in data and data["attraction_id"]:
        requete = "UPDATE attraction SET nom=?, localisation=?, constructeur=?, modele=?, classement=?, image_url=? WHERE attraction_id=?"
        req.update_from_db(requete, (data["nom"], data["localisation"], data["constructeur"], data["modele"], data["classement"], data["image_url"], data["attraction_id"]))
        return data["attraction_id"]
    else:
        requete = "INSERT INTO attraction (nom, localisation, constructeur, modele, classement, visible, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)"
        return req.insert_in_db(requete, (data["nom"], data["localisation"], data["constructeur"], data["modele"], data["classement"], data["visible"], data["image_url"]))

def get_all_attraction():
    json = req.select_from_db("SELECT * FROM attraction")
    
    return json

def get_attraction(id):
    if (not id):
        return False

    json = req.select_from_db("SELECT * FROM attraction WHERE attraction_id = ?", (id,))

    if len(json) > 0:
        return json[0]
    else:
        return []

def delete_attraction(id):
    if (not id):
        return False

    req.delete_from_db("DELETE FROM attraction WHERE attraction_id = ?", (id,))

    return True