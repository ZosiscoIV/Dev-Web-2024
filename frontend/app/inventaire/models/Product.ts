import { format } from 'date-fns';
import { fr } from 'date-fns/locale';


export class Product {
    constructor(
        public id: number,
        public produit: string,
        public quantite: number,
        public prix: number,
        public status: string,
        public dateLivraison: string | null,
        public unite: string,
        public dateDebutVente: string,
        public dateFinVente: string | null,
        public categorie: string,
        public taxe: number,
        public dispo: boolean,
        public imageURL?: string,
    ) {}
    getStatus(): string {
        try {
            if (typeof this.quantite !== 'number' || this.quantite === Infinity || this.quantite === -Infinity || this.quantite < 0){
                throw new TypeError('La quantité doit être un entier')
            }
            if(!this.dispo) return "🚫 Non disponible"
            if (this.quantite === 0) return "❌ Hors Stock";
            if (this.quantite < 5) return "⚠️ Faible Stock";
            return "✅ En Stock";
        }
        catch (error){
            return "La quantité doit être un entier"
        }
        
    }
    getFormatDate(date: string | null): string {
        try {
            if (date == null) return ""
            const typeDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
            if (typeDate.test(date)){
                return format(new Date(date), 'dd/MM/yyyy', { locale: fr })
            }
            return "La date de livraison doit être une date"

        }   
        catch (error){
            return "La date de livraison doit être une date"
        }
        
    }

}