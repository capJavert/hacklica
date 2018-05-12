import {Component, EventEmitter, Output} from '@angular/core';
import {Document} from "../chat/message";

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.less']
})
export class FileComponent {
  @Output() loadMore = new EventEmitter<Document>();
  document: Document;

  constructor() {}

  changeListener($event) : void {
    this.readFile($event.target);
  }

  readFile(inputValue: any): void {
    this.document = new Document();
    let file: File = inputValue.files[0];

    let myReader:FileReader = new FileReader();

    myReader.onloadend = () => {
      this.document.data = myReader.result;
      this.document.name = file.name;

      const base64string = this.document.data.split(",");

      if(base64string.length == 2) {
        this.document.data = base64string[1];
        this.loadMore.emit(this.document);
      }
    };

    myReader.readAsDataURL(file);
  }
}