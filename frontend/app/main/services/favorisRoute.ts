// app/api/favorites/route.ts
import axios from 'axios';
import { NextResponse, NextRequest } from 'next/server';


// Récupérer les favoris de l'utilisateur
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();

        // Vérifier si l'utilisateur est connecté
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        // Récupérer l'utilisateur via email (adapter selon votre modèle)
        const user = await prisma.user.findUnique({
            where: { email: session.user.email as string },
            include: { favorites: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        return NextResponse.json({ favorites: user.favorites });
    } catch (error) {
        console.error('Erreur lors de la récupération des favoris:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// Ajouter un produit aux favoris
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();

        // Vérifier si l'utilisateur est connecté
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const { productId } = await req.json();

        // Ajouter aux favoris
        await prisma.favorite.create({
            data: {
                userId: session.user.id as string,
                productId: productId
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erreur lors de l\'ajout aux favoris:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// app/api/favorites/[productId]/route.ts
export async function DELETE(
    req: NextRequest,
    { params }: { params: { productId: string } }
) {
    try {
        const session = await getServerSession();

        // Vérifier si l'utilisateur est connecté
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const productId = parseInt(params.productId);

        // Supprimer des favoris
        await prisma.favorite.deleteMany({
            where: {
                userId: session.user.id as string,
                productId: productId
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erreur lors de la suppression des favoris:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}