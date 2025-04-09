import { format } from 'date-fns';
import { fr } from 'date-fns/locale';


export class Product {
    constructor(
        public id: number,
        public produit: string,
        public quantite: number,
        public prix: number,
        public status: string,
        public dateLivraison: string | null 
    ) {}

    getStatus(): string {
        if (this.quantite === 0) return "❌ Hors Stock";
        if (this.quantite < 5) return "⚠️ Faible Stock";
        return "✅ En Stock";
    }
    getFormatDate(): string {
        if (this.dateLivraison == null) return ""
        return format(new Date(this.dateLivraison), 'dd/MM/yyyy', { locale: fr })

    }

}