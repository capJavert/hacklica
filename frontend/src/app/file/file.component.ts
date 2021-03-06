import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Document} from "../chat/message";
import {Router} from "@angular/router";
import {ConditionsUtil} from "../modules/utils/ConditionsUtil";

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.less']
})
export class FileComponent {
  @Output() onDocument = new EventEmitter<Document>();
  @Input() isBigFileManager: boolean;
  document: Document;

  constructor(public router: Router) {}

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
        this.onDocument.emit(this.document);
      }
    };

    if (ConditionsUtil.isNotNullNorEmpty(file)) {
      myReader.readAsDataURL(file);
    }
  }
}
