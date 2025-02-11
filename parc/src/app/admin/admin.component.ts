import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AttractionInterface } from '../Interface/attraction.interface';
import { DataService } from '../Service/data.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSlideToggleModule,
    MatButtonModule, MatCardModule, MatIconModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  attractions: AttractionInterface[] = [];
  attractionForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    this.attractionForm = this.formBuilder.group({
      attraction_id: [null],
      nom: ['', Validators.required],
      localisation: ['', Validators.required],
      constructeur: ['', Validators.required],
      modele: ['', Validators.required],
      classement: [0, Validators.required],
      visible: [true],
      image: [null]
    });
  }

  ngOnInit(): void {
    this.getAttractions();
  }

  getAttractions(): void {
    this.dataService.getData<AttractionInterface[]>('http://127.0.0.1:5000/attraction').subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.attractions = response.map(attr => ({
            ...attr,
            images: attr.images ?? []
          }));
        } else {
          console.error('Données reçues ne sont pas un tableau', response);
        }
      },
      error => console.error('Erreur lors de la récupération des attractions', error)
    );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    const formData = new FormData();
    Object.keys(this.attractionForm.controls).forEach(key => {
      formData.append(key, this.attractionForm.get(key)?.value);
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const url = this.attractionForm.get('attraction_id')?.value
      ? `http://127.0.0.1:5000/attraction/${this.attractionForm.get('attraction_id')?.value}`
      : 'http://127.0.0.1:5000/attraction';

    this.dataService.postData(url, formData).subscribe(
      () => {
        this.getAttractions();
        this.attractionForm.reset();
        this.attractionForm.patchValue({ visible: true });
        this.selectedFile = null;
      },
      error => console.error('Erreur lors de l’ajout', error)
    );
  }

  editAttraction(attr: AttractionInterface): void {
    this.attractionForm.patchValue(attr);
  }

  deleteAttraction(attractionId: number | null): void {
    if (attractionId !== null) {
      this.dataService.deleteData(`http://127.0.0.1:5000/attraction/${attractionId}`).subscribe(() => {
        this.attractions = this.attractions.filter(attr => attr.attraction_id !== attractionId);
      });
    }
  }
}
