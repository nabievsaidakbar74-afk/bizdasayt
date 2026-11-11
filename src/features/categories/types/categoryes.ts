export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    parentId: string | null;
    isActive: boolean;
    sortOrder: number;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    _count: {
        products: number;
    };
    children: Category[];
}

