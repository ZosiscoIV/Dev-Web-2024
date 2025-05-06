// fonction du component SearchResults

export interface Produit {
    id: number;
    produit: string;
    categorie: string;
    prix: number;
    image: string;
}

export function filterProducts(
    products: Produit[],
    query: string,
    category: string
): Produit[] {
    let filtered = products.filter((p) =>
        p.produit && p.produit.toLowerCase().includes(query.toLowerCase())
    );

    if (category !== "") {
        filtered = filtered.filter((p) => p.categorie === category);
    }

    return filtered;
}
