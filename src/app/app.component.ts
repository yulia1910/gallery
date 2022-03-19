import { Component, OnDestroy, OnInit } from '@angular/core';
import { switchMap, takeUntil, timer } from 'rxjs';
import { HttpService } from './http.service';
import { Image } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpService]
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private service: HttpService) { }

  title = 'galleryClient';
  url: string = 'https://localhost:44385/Gallery1/';
  step: number = 5;
  limit = 100;
  delay = 30000;
  data: Image[] = [];
  copy: Image[] = [];
  removedItem: Image;
  UpperImage: Image = {
    author: '',
    dounlowd_url: '',
    height: 0,
    id: '',
    url: '',
    width: 0
  };



  ngOnInit(): void {
    const indexs = timer(0, this.delay);
    const timer$ = timer(((this.limit / this.step)) * this.delay);//-1

    indexs.pipe(
      switchMap((index) => {
        return this.service.httpGet(this.url + index * this.step)
      }),
      takeUntil(timer$)
    ).subscribe((data) => {
      this.data = data;

      this.data = this.data?.map((el: Image) =>
      ({
        ...el,
        dounlowd_url: 'https://picsum.photos/id/' + el.id + '/' + el.width + '/' + el.height
      })
      );

      this.UpperImage = { ...this.data[2] };
      this.UpperImage.dounlowd_url = 'https://picsum.photos/id/' + this.UpperImage.id + '/' + this.UpperImage.width + '/' + this.UpperImage.height;

      this.copy = [... this.data];
      this.copy?.splice(2, 1);
      this.removedItem = this.copy.pop(); 
    });
  }

  imageUp(id: string){
    let temp = {...this.UpperImage};
    let index = this.copy.findIndex(item => item.id == id);
    let image = this.copy.find(item => item.id == id);
    this.copy.splice(index, 1, temp);
    this.UpperImage = image; 
  }

  onLeftClick(){
    let removed = this.copy.shift(); 
    this.copy.splice(2, 0, this.removedItem);
    this.removedItem = removed;
  }

  onRightClick(){
   let removed = this.copy.pop();
   this.copy.splice(0, 0, this.removedItem);
   this.removedItem = removed;
  }

  ngOnDestroy(): void {
    // this.subscription.forEach(item => item.unsubscribe())
  }

}
