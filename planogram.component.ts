import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';




@Component({
  selector: 'app-planogram',
  templateUrl: './planogram.component.html',
  styleUrls: ['./planogram.component.scss']
})
export class PlanogramComponent implements OnInit {

  currentCardDetails = '';
  toggleDropdown(form: any) {
    form.showDropdown = !form.showDropdown;
  }

  getNumberArray(count: number): number[] {
    return new Array(count);
  }

  
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      // If the card is moved within the same row
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // If the card is moved between rows
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  
  dbData: any;
  dialogForms: any[] = [];
  ngOnInit(): void {
    for (const form of this.dialogForms) {
      if (form && form.no_of_Rows && form.no_of_columns) {
          for (let i = 0; i < form.no_of_Rows; i++) {
              for (let j = 0; j < form.no_of_columns; j++) {
                  this.cardData.push({
                      details: {}
                  });
              }
          }
      }
  }
  
    this.cardData = [];
    this.http.get('./assets/db.json').subscribe((data: any) => {
  
      this.dbData = data;
    });
  }

  

  dialogForm = new FormGroup({
    title: new FormControl('', Validators.required),
    discription: new FormControl('',Validators.required),
    no_of_Rows: new FormControl('', Validators.required),
    no_of_columns: new FormControl('', Validators.required)
  });

  onSubmit() {
    if (this.dialogForm.valid) {
      const newForm = { ...this.dialogForm.value };
      
      let row = []
      // Add an entry for each card in cardData
      for (let i = 0; i < Number(newForm.no_of_Rows); i++) {
        // this.cardData.push({ details: {} });
        let column = [];
        for (let j=0;j<Number(newForm.no_of_columns);j++) {
          column.push({details:{}})
        }
        row.push(column)
        
      }
      if(row.length > 0) {
        this.cardData.push(row);
      }
      this.dialogForms.push(newForm);
      if (this.dialogForm.valid) {
        // Your form submission logic here
        this.closepopup();
      }
  
      this.dialogForm.reset();
    }
  }
  get ProductControl() {
    return this.cardForm.get('Product');
}

  cardData: any[] = [];
  selectedCardData: any = {}; 
  cardForm: FormGroup; 

  
  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Initialize your cardForm
    this.dialogForms = [];
    this.cardForm = this.fb.group({
      ItemName: ['', Validators.required],
      Product: ['', Validators.required],
      Maxquantity: ['', Validators.required],
      springType: ['',Validators.required],
      slotType: ['',Validators.required],
      rowNumber: [''],
      cardId: ['']
      // Add more form controls if needed
    });
    for (const form of this.dialogForms) {
      for (let i = 0; i < (form.no_of_Rows || 0); i++) {
        for (let j = 0; j < (form.no_of_columns || 0); j++) {
            this.cardData.push({
                details: {}
            });
        }
    }
  }


  
  }
  

  selectedCardIndices: number[] = [];  // Initialize with -1, indicating no card is selected
  isSelectedCard(index: number): boolean {
    return this.selectedCardIndices.includes(index);
  }

  openCardPopup(index: string, data:any) {
    if (index) {
      // this.selectedCardIndices.push(index);
      
      const cardDetails = data?.details || {};
      this.selectedCardData = {
        Product: cardDetails.Product || '',
        Maxquantity: cardDetails.Maxquantity || '',
        springType: cardDetails.springType || '',
        slotType: cardDetails.slotType || '',
        ItemName: cardDetails?.user?.name || '',
      };
      this.show1 = true;
      // this.cardForm.patchValue(this.selectedCardData);
      // this.cardForm['_selectedCardIndex'] = index;
      this.currentCardDetails = index;
      
    }
  }

  // Add a method to handle card form submission
  onsubmit1() {
    // const selectedCardIndex = this.cardForm['_selectedCardIndex'];
    if (this.currentCardDetails?.length>0) {
      let splitData = this.currentCardDetails.split('-')
      const selectedUser = this.dbData.users.find(user => user.name === this.cardForm.value.ItemName);
      // const [rowNumber, cardId] = this.cardForm.value.cardId.split(' ');
      // this.cardData[selectedCardIndex].details = {
      //   ItemName: this.cardForm.value.ItemName,
      //   Price: this.cardForm.value.Price,
      //   springType: this.cardForm.value.springType,
      //   slotType: this.cardForm.value.slotType,
      // };
      // // Optionally, store rowNumber and cardId in the details object if needed
      // this.cardData[selectedCardIndex].details.rowNumber = rowNumber;
      // this.cardData[selectedCardIndex].details.cardId = cardId;
      this.cardData[splitData[0]][splitData[1]][splitData[2]].details = {
        Product: this.cardForm.value.Product,
        Maxquantity: this.cardForm.value.Maxquantity,
        springType: this.cardForm.value.springType,
        slotType: this.cardForm.value.slotType,
        user: selectedUser || {} ,
        image: selectedUser?.image || '', // Add this line
        price: selectedUser?.price || '' 
      }
      this.cardData = this.cardData
      this.selectedCardData = {}; // Reset selectedCardData
      this.cardForm.reset();
      delete this.cardForm['_selectedCardIndex'];
      this.closecardpopup();
    }
  }
  editCardDetails(rowdata:string,data:any) {
    if(rowdata){
      let splitData = rowdata.split('-')
      // const index = JSON.parse(splitData[1]) * JSON.parse(splitData[1].length + j
      // const rowNumber = Math.floor(index / this.dialogForms[0].no_of_columns) + 1;
      // const cardId = index % this.dialogForms[0].no_of_columns + 1;
      const cardDetails = data?.details || {};
      this.selectedCardData = {
        Product: cardDetails.Product || '',
        Maxquantity: cardDetails.Maxquantity || '',
          springType: cardDetails.springType || '',
          slotType: cardDetails.slotType || '',
          ItemName: cardDetails?.user?.name || '',
          // rowNumber: rowNumber,
          cardId: `${splitData[1]}${splitData[2]}`,
      };
      this.show1 = true;
      this.cardForm.patchValue(this.selectedCardData);
      // this.cardForm['_selectedCardIndex'] = index;
    }
    
}
  

 

  
hasCardDetails(index: number): boolean {
  return this.cardData[index]?.details !== undefined;
}

Products: string[] = ['Item 1', 'Item 2', 'Item 3'];
  springTypes: string[] = ['type1','type2','type3'];
  slotTypes: string[] = ['slot1','slot2','slot3']
  show = false;
  show1 = false;

  


  closecardpopup(){
    this.show1 = false;
  }
  openpopup() {
    const selectedCardIndex = this.cardForm['_selectedCardIndex'];
    if (selectedCardIndex !== undefined) {
      this.selectedCardData = {
        Product: this.cardForm.value.Product || '',
        Maxquantity: this.cardForm.value.Maxquantity || '',
        
      };
    } else {
      this.selectedCardData = {};
    }

    this.show = true;  // Show the main popup
    this.dialogForm.patchValue(this.selectedCardData);
  }
  closepopup() {
    this.show = false;
  }

  getInt(data) {
    return data?JSON.parse(data):''
  }

}