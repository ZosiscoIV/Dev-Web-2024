import React from 'react' ;
import { render , screen } from '@testing-library/react' ;
import ProductTable from './ProductTable';
import { Product } from '../models/Product';

test('affiche la structure du tableau', () => {

    const mockSetProducts = jest.fn();
    const mockSetCategories = jest.fn();
    
    render( <ProductTable products={[]} setProducts={mockSetProducts} setCategories={mockSetCategories}/>)    
  
    const tableau = screen.getByRole('table');
  
    expect(tableau).toBeInTheDocument();
    
});

test('affiche un produit en stock', () => {
    const prod = new Product (
        1,
        "Banane",
        10,
        3,
        '',
        '2025-03-24T23:00:00.000Z',
        "kg",                         
        '2025-03-01T00:00:00.000Z',   
        '2025-04-01T00:00:00.000Z',   
        "Fruits",                     
        5    
    )
    const mockSetProducts = jest.fn();
    const mockSetCategories = jest.fn();
    
    render( <ProductTable products={[prod]} setProducts={mockSetProducts} setCategories={mockSetCategories}/>)    
    
    expect(screen.getByText('Banane')).toBeInTheDocument();
    expect(screen.getByText('10 kg')).toBeInTheDocument();
    expect(screen.getByText('3.00')).toBeInTheDocument();
    expect(screen.getByText('✅ En Stock')).toBeInTheDocument();
    expect(screen.getByText('25/03/2025')).toBeInTheDocument();

});

test('affiche un produit en stock limite', () => {
    const prod = new Product (
        1,
        "Banane",
        5,
        3,
        '',
        '2025-03-24T23:00:00.000Z',
        "kg",                         
        '2025-03-01T00:00:00.000Z',   
        '2025-04-01T00:00:00.000Z',   
        "Fruits",                     
        5    
    )
    const mockSetProducts = jest.fn();
    const mockSetCategories = jest.fn();
    
    render( <ProductTable products={[prod]} setProducts={mockSetProducts} setCategories={mockSetCategories}/>)    
    
    expect(screen.getByText('Banane')).toBeInTheDocument();
    expect(screen.getByText('3.00')).toBeInTheDocument();
    expect(screen.getByText('5 kg')).toBeInTheDocument();
    expect(screen.getByText('✅ En Stock')).toBeInTheDocument();
    expect(screen.getByText('25/03/2025')).toBeInTheDocument();

});

test('affiche un produit faible en stock', () => {
    const prod = new Product (
        1,
        "Banane",
        4,
        3,
        '',
        '2025-03-24T23:00:00.000Z',
        "kg",                         
        '2025-03-01T00:00:00.000Z',   
        '2025-04-01T00:00:00.000Z',   
        "Fruits",                     
        5    
    )
    const mockSetProducts = jest.fn();
    const mockSetCategories = jest.fn();
    
    render( <ProductTable products={[prod]} setProducts={mockSetProducts} setCategories={mockSetCategories}/>)    
    
    expect(screen.getByText('Banane')).toBeInTheDocument();
    expect(screen.getByText('3.00')).toBeInTheDocument();
    expect(screen.getByText('4 kg')).toBeInTheDocument();
    expect(screen.getByText('⚠️ Faible Stock')).toBeInTheDocument();
    expect(screen.getByText('25/03/2025')).toBeInTheDocument();

});

test('affiche un produit hors stock', () => {
    const prod = new Product (
        1,
        "Banane",
        0,
        3,
        '',
        '2025-03-24T23:00:00.000Z',"kg",                         
        '2025-03-01T00:00:00.000Z',   
        '2025-04-01T00:00:00.000Z',   
        "Fruits",                     
        5    
    )
    const mockSetProducts = jest.fn();
    const mockSetCategories = jest.fn();
    
    render( <ProductTable products={[prod]} setProducts={mockSetProducts} setCategories={mockSetCategories}/>)    
    
    expect(screen.getByText('Banane')).toBeInTheDocument();
    expect(screen.getByText('3.00')).toBeInTheDocument();
    expect(screen.getByText('0 kg')).toBeInTheDocument();
    expect(screen.getByText('❌ Hors Stock')).toBeInTheDocument();
    expect(screen.getByText('25/03/2025')).toBeInTheDocument();

});

test('affiche un produit en stock sans date de livraison', () => {
    const prod = new Product (
        1,
        "Banane",
        10,
        3,
        '',
        null,
        "kg",                         
        '2025-03-01T00:00:00.000Z',   
        '2025-04-01T00:00:00.000Z',   
        "Fruits",                     
        5    
    )
    const mockSetProducts = jest.fn();
    const mockSetCategories = jest.fn();
    
    render( <ProductTable products={[prod]} setProducts={mockSetProducts} setCategories={mockSetCategories}/>)    
    
    expect(screen.getByText('Banane')).toBeInTheDocument();
    expect(screen.getByText('3.00')).toBeInTheDocument();
    expect(screen.getByText('10 kg')).toBeInTheDocument();
    expect(screen.getByText('✅ En Stock')).toBeInTheDocument();
    const row = screen.getByText('Banane').closest('tr');
    expect(row).not.toBeNull();

    const cells = row!.querySelectorAll('td');
    expect(cells[7].querySelector('button')).toHaveTextContent('Ajouter une date de livraison');
});
