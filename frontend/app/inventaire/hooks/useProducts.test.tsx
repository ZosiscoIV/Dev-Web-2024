import React from 'react' ;
import axios from 'axios' ;
import { render , screen, waitFor } from '@testing-library/react' ;
import {useProducts} from './useProducts';
import { Product } from '../models/Product';
import * as api from "../services/productService"; // ou similaire

jest.mock( '../services/productService' ); 
const mockedAxios = axios as jest.Mocked<typeof axios>;

const TestComponent = ({ categorie, stock }:{categorie: string, stock: "tout" | "enStock" | "horsStock"}) => {
    const { products, errorMessage } = useProducts(categorie, stock);
  
    return (
      <div>
        {errorMessage && <p>{errorMessage}</p>}
        {products.map((prod) => (
          <div key={prod.id}>{prod.produit}</div>
        ))}
      </div>
    );
  };

test('récupère et affiche le produit' , async () => {  
    const mockResponse = new Product (
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
    );
    (api.getProducts as jest.Mock).mockResolvedValueOnce([mockResponse]); 
    render (<TestComponent categorie="tout" stock="tout" />); 
    const produitElement = await waitFor(() => screen.getByText ("Banane")); 
    expect( produitElement ).toBeInTheDocument(); 
});

test('affiche un message d\'erreur quand il n\y a pas de produits' , async () => {  

    (api.getProducts as jest.Mock).mockResolvedValueOnce([]); 
    render (<TestComponent categorie="tout" stock="tout" />); 
    const erreurMessage = await waitFor(() => screen.getByText("Aucun produit trouvé")); 
    expect( erreurMessage ).toBeInTheDocument(); 
});

test('affiche un message d\'erreur lors d\'un problème' , async () => {  
    (api.getProducts as jest.Mock).mockRejectedValueOnce(new Error("Erreur API")); 
    render (<TestComponent categorie="tout" stock="tout" />); 
    const erreurMessage = await waitFor(() => screen.getByText("Erreur lors de la récupération des produits")); 
    expect( erreurMessage ).toBeInTheDocument(); 
});

test('récupère et affiche le produit de la catégorie fruit et en stock' , async () => {  
    const mockResponse = new Product (
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
    );
    (api.getProducts as jest.Mock).mockResolvedValueOnce([mockResponse]); 
    render (<TestComponent categorie="Fruit" stock="enStock" />); 
    const produitElement = await waitFor(() => screen.getByText ("Banane")); 
    expect(api.getProducts as jest.Mock).toHaveBeenCalledWith("?categorie=Fruit&enStock=true")
    expect( produitElement ).toBeInTheDocument(); 
});

test('affiche un message d\'erreur quand il n\y a pas de produits pour la catégorie fruit et hors stock' , async () => {  
    (api.getProducts as jest.Mock).mockResolvedValueOnce([]); 
    render (<TestComponent categorie="Fruit" stock="horsStock" />);
    const erreurMessage = await waitFor(() => screen.getByText("Aucun produit trouvé")); 
    expect(api.getProducts as jest.Mock).toHaveBeenCalledWith("?categorie=Fruit&enStock=false")
    expect( erreurMessage ).toBeInTheDocument(); 
});


test('récupère et affiche les produits' , async () => {  
    const mockResponse = [new Product (
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
    ),
    new Product (
        2,
        "Pomme",
        4,
        6,
        '',
        '',
        "kg",                         
        '2025-03-01T00:00:00.000Z',   
        '2025-04-01T00:00:00.000Z',   
        "Fruits",                     
        5    
    )];
    (api.getProducts as jest.Mock).mockResolvedValueOnce(mockResponse); 
    render (<TestComponent categorie="tout" stock="tout" />); 
    const produitElement1 = await waitFor(() => screen.getByText ("Banane")); 
    expect( produitElement1 ).toBeInTheDocument();
    
    const produitElement2 = await waitFor(() => screen.getByText ("Pomme")); 
    expect( produitElement2 ).toBeInTheDocument(); 
});
