type FiltresProps = {
  categorie: string;
  stock: "tout" | "enStock" | "horsStock";
  categories: { id: number; categorie: string }[];
  onCategorieChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onStockChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};


const Filtre: React.FC<FiltresProps> = ({categorie, stock, categories,onCategorieChange, onStockChange }) => {
  return (
    <div id="filtre">
      <label htmlFor="categorie">Catégorie  </label>
      <select id="categorie" value={categorie} onChange={onCategorieChange}>
        <option value="tout">Toutes les catégories</option>
        {categories.map((categ) => (
          <option key={categ.id} value={categ.categorie}>{categ.categorie}</option>
        ))}
      </select>
    
      <input id="tout" type="radio" value="tout" checked={stock === 'tout'} onChange={onStockChange}/>
      <label htmlFor="tout">Tout le stock  </label>
      
      <input id="enStock" type="radio" value="enStock" checked={stock === 'enStock'} onChange={onStockChange}/>
      <label htmlFor="enStock">En stock  </label>

      <input id="horsStock" type="radio" value="horsStock" checked={stock === 'horsStock'} onChange={onStockChange}/>
      <label htmlFor="horsStock">Hors stock</label>
    </div>
  );
};
export default Filtre;