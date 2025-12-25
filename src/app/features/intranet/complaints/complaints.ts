import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplaintService } from '../../../core/services/complaint.service';
import { Complaint } from '../../../shared/models/complaint.model';

interface ComplaintExtended extends Complaint {
  id: string;
  codigoConfirmacion: string;
  createdAt: string;
}

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './complaints.html',
  styleUrl: './complaints.css',
})
export class Complaints implements OnInit {
  complaints: ComplaintExtended[] = [];
  filteredComplaints: ComplaintExtended[] = [];
  selectedComplaint: ComplaintExtended | null = null;
  
  // Filtros y búsqueda
  searchTerm: string = '';
  filterType: 'all' | 'nombre' | 'dni' | 'codigo' | 'fecha' = 'all';
  selectedDate: string = '';
  
  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 10;
  
  // Estados
  isLoading: boolean = false;
  showDetailModal: boolean = false;

  constructor(private complaintService: ComplaintService) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.isLoading = true;
    this.complaintService.getAllComplaints().subscribe({
      next: (complaints: any[]) => {
        this.complaints = complaints;
        this.filteredComplaints = complaints;
        this.isLoading = false;
        console.log('📄 Reclamos cargados:', complaints);
      },
      error: (error) => {
        console.error('❌ Error al cargar reclamos:', error);
        this.isLoading = false;
      }
    });
  }

  // Búsqueda y filtrado
  applyFilters(): void {
    let filtered = [...this.complaints];

    // Filtro por término de búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      
      filtered = filtered.filter(complaint => {
        switch (this.filterType) {
          case 'nombre':
            const fullName = `${complaint.nombres} ${complaint.apellidoPaterno} ${complaint.apellidoMaterno}`.toLowerCase();
            return fullName.includes(term);
          
          case 'dni':
            return complaint.numeroDocumento.includes(term);
          
          case 'codigo':
            return complaint.codigoConfirmacion.toLowerCase().includes(term);
          
          case 'fecha':
            return this.formatDate(complaint.fecha).includes(term);
          
          case 'all':
          default:
            const searchableText = `
              ${complaint.nombres}
              ${complaint.apellidoPaterno}
              ${complaint.apellidoMaterno}
              ${complaint.numeroDocumento}
              ${complaint.codigoConfirmacion}
              ${complaint.email}
            `.toLowerCase();
            return searchableText.includes(term);
        }
      });
    }

    // Filtro por fecha específica
    if (this.selectedDate) {
      filtered = filtered.filter(complaint => {
        const complaintDate = new Date(complaint.fecha).toISOString().split('T')[0];
        return complaintDate === this.selectedDate;
      });
    }

    this.filteredComplaints = filtered;
    this.currentPage = 1; // Resetear a la primera página
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterType = 'all';
    this.selectedDate = '';
    this.filteredComplaints = [...this.complaints];
    this.currentPage = 1;
  }

  // Paginación
  get paginatedComplaints(): ComplaintExtended[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredComplaints.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredComplaints.length / this.itemsPerPage);
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Visualización de detalles
  viewDetails(complaint: ComplaintExtended): void {
    this.selectedComplaint = complaint;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedComplaint = null;
  }

  // Descarga de PDF individual
  downloadPDF(complaint: ComplaintExtended): void {
    // Aquí implementarás la lógica de generación de PDF
    console.log('📥 Descargando PDF para:', complaint.codigoConfirmacion);
    
    // Ejemplo básico de generación de contenido para PDF
    const pdfContent = this.generatePDFContent(complaint);
    
    // TODO: Implementar generación real de PDF con jsPDF o similar
    alert(`Generando PDF para reclamo ${complaint.codigoConfirmacion}`);
  }

  // Descarga masiva de todos los reclamos filtrados
  downloadAllPDFs(): void {
    if (this.filteredComplaints.length === 0) {
      alert('No hay reclamos para descargar');
      return;
    }
    
    console.log('📥 Descargando todos los PDFs filtrados:', this.filteredComplaints.length);
    alert(`Generando ${this.filteredComplaints.length} PDFs...`);
    // TODO: Implementar descarga masiva
  }

  // Exportar a CSV
  exportToCSV(): void {
    if (this.filteredComplaints.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const headers = [
      'Código',
      'Fecha',
      'Nombres',
      'Apellido Paterno',
      'Apellido Materno',
      'Tipo Doc',
      'Número Doc',
      'Email',
      'Teléfono',
      'Celular',
      'Dirección',
      'Distrito',
      'Departamento',
      'Detalle'
    ];

    const csvRows = [
      headers.join(','),
      ...this.filteredComplaints.map(c => [
        c.codigoConfirmacion,
        this.formatDate(c.fecha),
        c.nombres,
        c.apellidoPaterno,
        c.apellidoMaterno,
        c.tipoDocumento,
        c.numeroDocumento,
        c.email,
        c.telefonoFijo || '-',
        c.telefonoCelular,
        `"${c.direccion}"`,
        c.distrito,
        c.departamento,
        `"${c.detalleReclamo}"`
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `reclamos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Utilidades
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getFullName(complaint: ComplaintExtended): string {
    return `${complaint.nombres} ${complaint.apellidoPaterno} ${complaint.apellidoMaterno}`;
  }

  getDocumentTypeLabel(type: string): string {
    const labels: any = {
      'dni': 'DNI',
      'pasaporte': 'Pasaporte',
      'carnet_extranjeria': 'C. Extranjería'
    };
    return labels[type] || type;
  }

  private generatePDFContent(complaint: ComplaintExtended): string {
    return `
      Libro de Reclamaciones
      Código: ${complaint.codigoConfirmacion}
      Fecha: ${this.formatDate(complaint.fecha)}
      
      DATOS DEL RECLAMANTE:
      Nombres: ${this.getFullName(complaint)}
      ${this.getDocumentTypeLabel(complaint.tipoDocumento)}: ${complaint.numeroDocumento}
      Email: ${complaint.email}
      Teléfono: ${complaint.telefonoCelular}
      Dirección: ${complaint.direccion}, ${complaint.distrito}, ${complaint.departamento}
      
      DETALLE DEL RECLAMO:
      ${complaint.detalleReclamo}
    `;
  }
}