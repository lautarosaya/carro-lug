import e, { Request, Response } from "express";
import cartModel from "../models/cart";
import productModel from "../models/product";

const cartController = {
  get: async (req: Request, res: Response) => {
    try {
      //*crea carrito y encuentra si hay carrito
      const myCart = await cartModel.findOne();
      if (!myCart) {
        //*si no hay no hay
        res.send("El carrito se encuentra vacio");
      } else {
        //declaramos variables para for
        let i;
        let total = 0;
        let subTotal = 0;
        let cant = 0;
        //*buscamos en la variable mycart
        const myCart = await cartModel.find();
        for (i = 0; i < myCart.length; i++) {
          //*asignamos valores segun picicion del array
          subTotal = myCart[i].productPrice;
          cant = myCart[i].productAmount; //Pasa por la longitud del carro y con un acumulador suma los precios
          total = total + cant * subTotal;
        }
        //*devuelve esto
        res
          .status(200)
          .send(`Su carrito:\n   ${myCart}\n  Precio total: ${total}`);
      }
    } catch (error) {
      //*por si hay un error que lo capture
      res.status(500).send(error);
    }
  },
  add: async (req: Request, res: Response) => {
    try {
      //*va a buscar en product model un product id que ponemos en el body de postman
      const inProducts = await productModel.findOne({
        productID: req.body.productID,
      });
      //* lo mismo pero lo busca en el carrito
      const inCart = await cartModel.findOne({ productID: req.body.productID });

      if (!inProducts) {
        //!Si el producto no se encuentra en la lista de productos
        res.send("Este producto no existe");
      } else if (!inCart) {
        //Si el producto no se encuentra en el carro
        if (inProducts.productStock > 0) {
          //Si hay stock del producto
          const productInCart = new cartModel({
            productID: inProducts.productID,
            productName: inProducts.productName,
            productAmount: 1,
            productPrice: inProducts.productPrice,
          }); //* pedis el productid, productname, asignas una cantidad y pedis productprice que esta en productos

          inProducts.productStock--;
          inProducts.save();
          productInCart.save();
          res.send(
            `Se agrego el producto ${productInCart.productName} al carrito!`
          );
        } else if (inProducts.productStock < 1) {
          //Si no hay stock del producto
          res.send("No hay suficiente stock del producto");
        }
      } else if (inCart) {
        //!Si el producto ya se encuentra en el carro
        if (inProducts.productStock > 0) {
          //Si hay stock del producto
          inProducts.productStock--;
          inProducts.save();
          inCart.productAmount++;
          inCart.save();
          res.send(
            `Se agrego el producto ${inCart.productName} al carrito! Total de ${inCart.productAmount}`
          );
        } else if (inProducts.productStock < 1) {
          //Si no hay stock del producto
          res.send("No hay suficiente stock del producto");
        }
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      //*te pide el id para borrar el producto del modelode productos
      const inProducts = await productModel.findOne({
        productID: req.body.productID,
      });
      //Con estas 2 variables se fija posteriormente si el producto existe y si esta en el carrito
      //*te pide el id para borrar el producto del carrito
      const inCart = await cartModel.findOne({ productID: req.body.productID });

      if (!inProducts) {
        res.send("El producto no existe");
      } else if (!inCart) {
        res.send("El producto no se encuentra en el carrito");
      } else if (inCart && inCart.productAmount == 1) {
        const delProduct = await cartModel.findOneAndDelete({
          productID: req.body.productID,
        });
        inProducts.productStock++; //*Al eliminarse del carrito el stock aumenta nuevamente

        inProducts.save();
        res.send(`Se elimino el producto ${inCart.productName} del carrito!`);
      }
      //* si no cumple ninguno de los if anteriores va a ahacer esto
      else if (inCart) {
        inCart.productAmount--;
        inCart.save();
        inProducts.productStock++;
        inProducts.save();
        res.send(
          `Se elimino 1 ${inCart.productName} del carrito! Total de ${inCart.productAmount} restantes en el carrito.`
        );
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
};

export default cartController;
