import { Component,CUSTOM_ELEMENTS_SCHEMA, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from './product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports:[CommonModule,FormsModule],
  styleUrls: ['./app.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements OnInit{
  products: any[] = [];

  editingProduct: any = null;
  editProductname: string = '';
  editProductprice: number = 0;
  isSaving: boolean = false;
  newProductname:string='';
  newProductprice:number=0;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error fetching products', err)
    });
  }

  onEditProduct(product: any) {
    this.editingProduct = product;
    this.editProductname = product.product_name;
    this.editProductprice = product.price;
  }

  addProduct(){
    const product={
      product_name:this.newProductname.trim(),
      price:this.newProductprice
    };
    if(!product.product_name || product.price<=0){
      alert("please enter valid credentials");
      return;
    }
    this.productService.addProduct(product).subscribe({
      next:(res:any)=>{
        alert("product added sucessfully!");
        this.products.push(res);
        this.loadProducts();
        this.newProductname='';
        this.newProductprice=0;
      },
      error:(err)=>{
        alert("failed to add product");
      }
    });
  }
  saveProduct() {
    this.isSaving = true;

    const updatedProduct = {
      product_name: this.editProductname.trim(),
      price: this.editProductprice
    };

    this.productService.updateProduct(this.editingProduct.id, updatedProduct).subscribe({
      next: () => {
        alert('Product updated successfully!');
        const index = this.products.findIndex(p => p.id === this.editingProduct.id);
        if (index !== -1) {
          this.products[index] = { ...this.editingProduct, ...updatedProduct };
        }
        this.editingProduct = null;
        this.isSaving = false;
      },
      error: (err) => {
        alert('Failed to update product.');
        console.error(err);
        this.isSaving = false;
      }
    });
  }

  cancelEdit() {
    this.editingProduct = null;
  }

  onDeleteProduct(product:any){
    if(confirm('Are you sure you want to delete')){
      this.productService.deleteProduct(product.id).subscribe(()=>{
        alert("product deleted");
        this.loadProducts();
      })
    }
  }
}