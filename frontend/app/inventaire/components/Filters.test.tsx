import React from 'react' ;
import { render , screen, fireEvent} from '@testing-library/react' ;
import Filtre from './Filters';

test('affiche les filtres', () => {
    
    const categories = [{"id":1,"categorie":"Fruits"},{"id":2,"categorie":"Légumes"}]
    const mockCategorie = jest.fn();
    const mockStock = jest.fn();

    render(<Filtre categorie="tout" stock="tout" categories={categories} onCategorieChange={mockCategorie} onStockChange={mockStock} />);
  
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    const toutStock = screen.getByLabelText('Tout le stock');
    expect(toutStock).toBeInTheDocument();

    const enStock = screen.getByLabelText('En stock');
    expect(enStock).toBeInTheDocument();

    const horsStock = screen.getByLabelText('Hors stock');
    expect(horsStock).toBeInTheDocument();
    
    const fruitOption = screen.getByRole('option', {name: 'Fruits'})
    expect(fruitOption).toBeInTheDocument();

    const legumeOption = screen.getByRole('option', {name: 'Légumes'})
    expect(legumeOption).toBeInTheDocument();
});
