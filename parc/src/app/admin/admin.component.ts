import { Component } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AttractionInterface } from '../Interface/attraction.interface';
import { AttractionService } from '../Service/attraction.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, MatButtonModule, MatCardModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

  public formulaireAttractions: FormGroup[] = [];

  constructor(public attractionService: AttractionService, public formBuilder: FormBuilder, private _snackBar: MatSnackBar)
  {}
  
  public attractions: Observable<AttractionInterface[]> = this.attractionService.getAllAttraction().pipe(tap((attractions:AttractionInterface[]) => {
    attractions.forEach(attraction => {
      this.formulaireAttractions.push(
        new FormGroup({
          attraction_id: new FormControl(attraction.attraction_id),
          nom: new FormControl(attraction.nom, [Validators.required]),
          localisation: new FormControl(attraction.localisation, [Validators.required]),
          constructeur: new FormControl(attraction.constructeur, [Validators.required]),
          modele: new FormControl(attraction.modele, [Validators.required]),
          classement: new FormControl(attraction.classement),
          critique: new FormControl(attraction.critique),
          visible: new FormControl(attraction.visible)
        })
      );
    });
  }));

  public onSubmit(attractionFormulaire: FormGroup) {
    console.log(attractionFormulaire)
    this.attractionService.postAttraction(attractionFormulaire.getRawValue()).subscribe(result => {
      attractionFormulaire.patchValue({attraction_id: result.result});
      this._snackBar.open(result.message, undefined, {
        duration: 1000
      });
    });
  }

  public addAttraction() {
    this.formulaireAttractions.push(
      new FormGroup({
        attraction_id: new FormControl(),
        nom: new FormControl("", [Validators.required]),
        localisation: new FormControl("", [Validators.required]),
        constructeur: new FormControl("", [Validators.required]),
        modele: new FormControl("", [Validators.required]),
        classement: new FormControl("",[Validators.required]),
        critique: new FormControl(),
        visible: new FormControl(true)
      })
    );
  }

  public addCritique(attractionId: number) {
    const attractionForm = this.formulaireAttractions.find(f => f.value.attraction_id === attractionId);
    if (attractionForm) {
      attractionForm.addControl(
        'critiqueForm',
        new FormGroup({
          nom: new FormControl('Anonyme'),
          prenom: new FormControl('Anonyme'),
          note: new FormControl(5, [Validators.required, Validators.min(1), Validators.max(5)]),
          texte: new FormControl('', [Validators.required])
        })
      );
    }
  }

  public onSubmitCritique(attractionId: number, critiqueForm: FormGroup) {
    let critique = { ...critiqueForm.value, attraction_id: attractionId };
    this.attractionService.postCritiques(critique).subscribe(result => {
      this._snackBar.open('Critique ajoutée avec succès!', undefined, { duration: 1000 });
    });
  }

}
