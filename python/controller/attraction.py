import request.request as req

def add_attraction(data):
    print(data, flush=True)
    if (not "nom" in data or data["nom"] == ""):
        return False
    
    if (not "localisation" in data or data["localisation"] == ""):
        return False

    if (not "constructeur" in data or data["constructeur"] == ""):
        return False
    
    if (not "modele" in data or data["modele"] == ""):
        return False
    
    if (not "classement" in data or data["classement"] is None):
        return False

    if (not "visible" in data):
        data["visible"] = True

    if ("attraction_id" in data and data["attraction_id"]):
      requete = f"UPDATE attraction SET nom='{data['nom']}', localisation='{data['localisation']}', constructeur={data['constructeur']}, modele={data['modele']}, classement={data['classement']} WHERE attraction_id = {data['attraction_id']}"
      req.insert_in_db(requete)
      id = data['attraction_id']
    else:
      requete = "INSERT INTO attraction (nom, localisation, constructeur, modele, classement, visible) VALUES (?, ?, ?, ?, ?, ?);"
      id = req.insert_in_db(requete, (data["nom"], data["localisation"], data["constructeur"], data["modele"],data["classement"], data["visible"]))

    return id

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