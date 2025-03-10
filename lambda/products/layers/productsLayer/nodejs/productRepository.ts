import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { v4 as uuid } from "uuid";

export interface Product {
    id: string;
    productName: string;
    code: string;
    price: number; 
    model: string;
}

export class ProductRepository {
    private ddbClient: DocumentClient;
    private productsDdb: string;

    constructor(ddbClient: DocumentClient, productsDdb: string) {
        this.ddbClient = ddbClient;
        this.productsDdb = productsDdb;
    }

    async getAllProducts(): Promise<Product[]> {
        try {
            const data = await this.ddbClient.scan({
                TableName: this.productsDdb
            }).promise();
            return data.Items as Product[];
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            throw new Error("Erro ao buscar produtos");
        }
    }

    async getProductById(productId: string): Promise<Product> {
        try {
            const data = await this.ddbClient.get({
                TableName: this.productsDdb,
                Key: {
                    id: productId
                }
            }).promise();
            if (data.Item) {
                return data.Item as Product;
            } else {
                throw new Error('Product not found');
            }
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
            throw new Error("Erro ao buscar produto");
        }
    }

    async create(product: Product): Promise<Product> {
        try {
            // Gera um ID único para o produto
            product.id = uuid();

            // Insere o produto no DynamoDB
            await this.ddbClient.put({
                TableName: this.productsDdb,
                Item: product
            }).promise();

            // Retorna o produto criado
            return product;
        } catch (error) {
            console.error("Erro ao criar produto:", error);
            throw new Error("Erro ao criar produto");
        }
    }

    async deleteProduct(productId: string): Promise<Product> {
        try {
            const data = await this.ddbClient.delete({
                TableName: this.productsDdb,
                Key: {
                    id: productId
                },
                ReturnValues: "ALL_OLD"
            }).promise();
            if (data.Attributes) {
                return data.Attributes as Product;
            } else {
                throw new Error('Product not found');
            }
        } catch (error) {
            console.error("Erro ao deletar produto:", error);
            throw new Error("Erro ao deletar produto");
        }
    }

    async updateProduct(productId: string, product: Product): Promise<Product> {
        try {
            const data = await this.ddbClient.update({
                TableName: this.productsDdb,
                Key: {
                    id: productId
                },
                ConditionExpression: 'attribute_exists(id)', // Garante que o produto existe
                ReturnValues: "UPDATED_NEW",
                UpdateExpression: "set productName = :n, code = :c, price = :p, model = :m",
                ExpressionAttributeValues: {
                    ":n": product.productName,
                    ":c": product.code,
                    ":p": product.price,
                    ":m": product.model
                }
            }).promise();

            // Retorna o produto atualizado
            return {
                ...data.Attributes,
                id: productId // Garante que o ID correto seja retornado
            } as Product;
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            throw new Error("Erro ao atualizar produto");
        }
    }
}