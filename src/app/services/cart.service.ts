import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProductService} from "./product.service";
import {OrderService} from "./order.service";
import {environment} from "../../environments/environment";
import {CartModelPublic, CartModelServer} from "../models/cart.model";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import {ProductModelServer} from "../models/product.model";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private ServerURL = environment.SERVER_URL;

  private cartDataClient: CartModelPublic = {
    total: 0,
    prodData: [{
      incart: 0,
      id: 0
    }]
  };
  private cartDataServer: CartModelServer = {
    total: 0,
    data: [{
      numInCart: 0,
      product: undefined
    }],

  };

  cartTotal$ = new BehaviorSubject<number>(0);
  cartDataObs$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);




  constructor(private productService: ProductService,
              private orderService: OrderService,
              private httpClient: HttpClient,
              private router: Router) {

    this.cartTotal$.next(this.cartDataServer.total);
    this.cartDataObs$.next(this.cartDataServer);

    let info: CartModelPublic = JSON.parse(localStorage.getItem('cart'));

    if (info !== null && info !== undefined && info.prodData[0].incart !== 0){
      this.cartDataClient = info;

      this.cartDataClient.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProdInfo: ProductModelServer) => {
          if (this.cartDataServer.data[0].numInCart === 0){
            this.cartDataServer.data[0].numInCart = p.incart;
            this.cartDataServer.data[0].product = actualProdInfo;
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          } else {
            this.cartDataServer.data.push({
              numInCart: p.incart,
              product: actualProdInfo
            });
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          }
          this.cartDataObs$.next({...this.cartDataServer});
        });
      });

    }




  }
}
