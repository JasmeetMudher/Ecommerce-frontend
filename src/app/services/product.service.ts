import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductModelServer, ServerResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getAllProducts(limitOfResults = 10): Observable<ServerResponse> {
    const url = 'http://localhost:3000/api/products';
    const params = new HttpParams().set('limit', limitOfResults.toString());

    return this.http.get<ServerResponse>(url, { params });
  }

  getSingleProduct(id: number): Observable<ProductModelServer> {
    const url = 'http://localhost:3000/api/products/' + id;
    return this.http.get<ProductModelServer>(url);
  }

  getProductsFromCategory(catName: string): Observable<ProductModelServer[]> {
    const url = 'http://localhost:3000/api/products/category/' + catName;
    return this.http.get<ProductModelServer[]>(url);
  }
}
