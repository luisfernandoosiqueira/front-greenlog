import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DataSet, Network } from 'vis-network/standalone';
import { RuasService } from '../../services/ruas.service';

@Component({
  selector: 'app-grafo',
  template: `<div #grafo style="width: 100%; height: 600px; max-width: 1440px; overflow: hidden; margin: auto;"></div>`,
})
export class GrafoComponent implements OnInit {
  @ViewChild('grafo', { static: true }) grafoEl!: ElementRef;

  constructor(private ruasService: RuasService) {}

  ngOnInit() {
    this.ruasService.obterGrafo().subscribe(({ nodes, edges }) => {
      const container = this.grafoEl.nativeElement;

      const fixedNodes = nodes.map(node => ({
        ...node,
        fixed: false,
        color: {
          background: '#0f6d3a', // cor padrão azul clara
          border: '#000000',     // borda preta padrão
        },
        borderWidth: 1,
      }));

      const cleanedEdges = edges.map(edge => {
        const { arrows, ...rest } = edge;
        return {
          ...rest,
          color: { color: '#005928' }, // cor padrão cinza escuro
          width: 1,
        };
      });

      const data = {
        nodes: new DataSet(fixedNodes),
        edges: new DataSet(cleanedEdges),
      };

      const options = {
        layout: { improvedLayout: true },
        physics: {
          enabled: true,
          barnesHut: {
            gravitationalConstant: -20000,
            centralGravity: 0.1,
            springLength: 200,
            springConstant: 0.03,
            damping: 0.09,
            avoidOverlap: 1,
          },
        },
        nodes: {
          shape: 'dot',
          size: 20,
          font: { size: 16, color: '#333' },
          borderWidthSelected: 4,
        },
        edges: {
          arrows: { to: false, from: false, middle: false },
          smooth: { enabled: true, type: 'curvedCW', roundness: 0.7 },
          font: { align: 'top', size: 12 },
        },
        interaction: { dragNodes: false },
      };

      const network = new Network(container, data, options);

      network.on('selectNode', (params) => {
        const selectedNodeId = params.nodes[0];
        const connectedEdges = network.getConnectedEdges(selectedNodeId);
        const connectedNodes = new Set<number | string>([selectedNodeId]);

        connectedEdges.forEach(edgeId => {
          const edge = data.edges.get(edgeId);
          if (edge) {
            connectedNodes.add(edge.from);
            connectedNodes.add(edge.to);
          }
        });

        data.nodes.forEach(node => {
          if (node.id === selectedNodeId) {
            // nó selecionado: fundo amarelo e borda preta mais grossa
            data.nodes.update({
              id: node.id,
              color: { background: '#0f6d3a', border: '#000000' }, // amarelo + preto
              borderWidth: 1,
              opacity: 1,
            });
          } else if (connectedNodes.has(node.id)) {
            // nós conectados: fundo verde e borda preta normal
            data.nodes.update({
              id: node.id,
              color: { background: '#3fa34d', border: '#000000' },
              borderWidth: 1,
              opacity: 1,
            });
          } else {
            // resto desbotado e borda cinza claro
            data.nodes.update({
              id: node.id,
              color: { background: '#005928', border: '#005928' },
              borderWidth: 1,
              opacity: 0.2,
            });
          }
        });

        data.edges.forEach(edge => {
          if (connectedEdges.includes(edge.id as string | number)) {
            data.edges.update({
              id: edge.id,
              color: { color: '#3fa34d' },
              width: 1,
            });
          } else {
            data.edges.update({
              id: edge.id,
              color: { color: '#ddd' },
              width: 1,
            });
          }
        });
      });

      network.on('deselectNode', () => {
        data.nodes.forEach(node => {
          data.nodes.update({
            id: node.id,
            color: { background: '#0f6d3a', border: '#000000' },
            borderWidth: 1,
            opacity: 1,
          });
        });
        data.edges.forEach(edge => {
          data.edges.update({
            id: edge.id,
            color: { color: '#005928' },
            width: 1,
          });
        });
      });
    });
  }
}
