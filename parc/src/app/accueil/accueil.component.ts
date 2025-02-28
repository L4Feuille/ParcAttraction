import { Component } from '@angular/core';
import { AttractionService } from '../Service/attraction.service';
import { CritiqueService } from '../Service/critique.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AttractionInterface } from '../Interface/attraction.interface';
import { CritiqueInterface } from '../Interface/critique.interface';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss'
})
export class AccueilComponent {

  constructor(public attractionService: AttractionService, public critiqueService: CritiqueService)
  {}
  
  public attractions: Observable<AttractionInterface[]> = this.attractionService.getAllAttraction()
  public critiques :  Observable<CritiqueInterface[]> = this.critiqueService.getAllCritique()

}
