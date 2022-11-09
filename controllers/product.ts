import { Request, Response } from "express";
import cartModel from "../models/cart";
import productModel from "../models/product";

const productController = {
  get: async (req: Request, res: Response) => {
    try {
      //* crea all cart te busca todos los productos y te lo muestra en el postman
      const allCart = await productModel.find();
      res.status(200).send(allCart);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  add: async (req: Request, res: Response) => {
    try {
      //* te pide el id que ingresas por postman
      const inProducts = await productModel.findOne({
        productID: req.body.productID,
      });
      //* pregunta si el id esta dentro de productos
      if (!inProducts) {
        const newProduct = new productModel({ ...req.body });
        await newProduct.save();
        res.send(`Nuevo producto agregado al sistema:\n   ${newProduct}`);
      }
      //*si el id ya esta en productos
      else if (inProducts) {
        res.send("Ya existe el producto");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      //*busca el id que pusimos en postman
      const inProducts = await productModel.findOne({
        productID: req.body.productID,
      });
      //* si no existe el id dentro de los productos
      if (!inProducts) {
        res.send("No existe el producto");
      } //*si existe dentro de productos
      else if (inProducts) {
        const productoEliminado = await productModel.findOneAndDelete({
          productID: req.body.productID,
        });
        res.send("El producto ha sido eliminado");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
};

export default productController;
