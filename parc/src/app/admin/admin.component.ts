import { Component, OnInit, NgModule } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AttractionInterface } from '../Interface/attraction.interface';
import { AttractionService } from '../Service/attraction.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { DataService } from '../Service/data.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, MatButtonModule, MatCardModule, MatIconModule, FormsModule, BrowserModule ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  attractions: AttractionInterface[] = [];
  attraction: AttractionInterface = this.resetAttraction();
  selectedFile: File | null = null;

  constructor(private dataService: DataService) {}

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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('nom', this.attraction.nom);
    formData.append('localisation', this.attraction.localisation);
    formData.append('constructeur', this.attraction.constructeur);
    formData.append('modele', this.attraction.modele);
    formData.append('classement', this.attraction.classement.toString());
    formData.append('visible', this.attraction.visible.toString());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const url = this.attraction.attraction_id
      ? `http://127.0.0.1:5000/attraction/${this.attraction.attraction_id}`
      : 'http://127.0.0.1:5000/attraction';

    this.dataService.postData(url, formData).subscribe(
      () => {
        this.getAttractions();
        this.attraction = this.resetAttraction();
      },
      error => console.error('Erreur lors de l’ajout', error)
    );
  }

  editAttraction(attr: AttractionInterface): void {
    this.attraction = { ...attr };
  }

  deleteAttraction(attractionId: number | null): void {
    if (attractionId !== null) {
      this.dataService.deleteData(`http://127.0.0.1:5000/attraction/${attractionId}`).subscribe(() => {
        this.attractions = this.attractions.filter(attr => attr.attraction_id !== attractionId);
      });
    }
  }
  

  resetAttraction(): AttractionInterface {
    return {
      attraction_id: 0,
      nom: '',
      localisation: '',
      constructeur: '',
      modele: '',
      classement: 0,
      visible: true,
      images: []
    };
  }
}
