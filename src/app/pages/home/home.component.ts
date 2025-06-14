import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { GrafoComponent } from "../../components/network-graph/network-graph.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, FooterComponent, GrafoComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
}