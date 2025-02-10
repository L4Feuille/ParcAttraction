export interface AttractionInterface {
    attraction_id: number | null,
    nom: string,
    localisation: string,
    constructeur: string, 
    modele: string, 
    classement: number,
    visible: boolean,
    critique?: CritiqueInterface[],
    images: { image_url: string }[];
}

export interface CritiqueInterface{
    critique_id: number,
    attraction_id: number,
    nom?: string,
    prenom?: string,
    note: number,
    texte: string,
}