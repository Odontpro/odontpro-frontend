import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplaintService } from '../../../core/services/complaint.service';
import { Complaint } from '../../../shared/models/complaint.model';
import { jsPDF } from 'jspdf';

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
    const doc = new jsPDF();
      const margin = 20;
      const primaryColor = [125, 192, 191]; // El color #7dc0bf en RGB

      // --- ENCABEZADO ---
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('HOJA DE RECLAMACIÓN', margin, 20);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('OdontPro - Gestión Odontológica Profesional', margin, 30);
      doc.text(`Código: ${complaint.codigoConfirmacion}`, 150, 25);

      // --- INFORMACIÓN GENERAL ---
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('1. DATOS DEL RECLAMANTE', margin, 55);
      
      // Línea decorativa
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.line(margin, 57, 190, 57);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const dataY = 65;
      const col1 = margin;
      const col2 = 110;

      // Fila 1
      doc.text(`Nombre Completo: ${this.getFullName(complaint)}`, col1, dataY);
      doc.text(`Fecha de Registro: ${this.formatDate(complaint.fecha)}`, col2, dataY);

      // Fila 2
      doc.text(`${this.getDocumentTypeLabel(complaint.tipoDocumento)}: ${complaint.numeroDocumento}`, col1, dataY + 10);
      doc.text(`Correo: ${complaint.email}`, col2, dataY + 10);

      // Fila 3
      doc.text(`Celular: ${complaint.telefonoCelular}`, col1, dataY + 20);
      doc.text(`Ubicación: ${complaint.distrito}, ${complaint.departamento}`, col2, dataY + 20);

      // Fila 4 (Dirección completa)
      doc.text(`Dirección: ${complaint.direccion}`, col1, dataY + 30);

      // --- DETALLE DEL RECLAMO ---
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('2. DETALLE DEL RECLAMO', margin, 115);
      doc.line(margin, 117, 190, 117);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      
      // Ajuste automático de texto largo (detalleReclamo)
      const splitDetail = doc.splitTextToSize(complaint.detalleReclamo, 170);
      doc.text(splitDetail, margin, 125);

      // --- PIE DE PÁGINA O AUTORIZACIÓN ---
      const footerY = 260;
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      
      if (complaint.autorizacionNotificacion) {
        doc.text('* El usuario autorizó la notificación del resultado vía email.', margin, footerY);
      }
      
      doc.setFont('helvetica', 'italic');
      doc.text('Documento generado automáticamente por el sistema OdontPro.', margin, footerY + 10);

      // Descargar el archivo
      doc.save(`Reclamo_${complaint.codigoConfirmacion}.pdf`);
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
  
  exportToCSV(): void {
    if (this.filteredComplaints.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Definimos los encabezados
    const headers = [
      'Código', 'Fecha', 'Nombres', 'Apellido Paterno', 'Apellido Materno',
      'Tipo Doc', 'Número Doc', 'Email', 'Teléfono', 'Celular',
      'Dirección', 'Distrito', 'Departamento', 'Detalle'
    ];

    // Usaremos punto y coma (;) como separador para mejor compatibilidad con Excel en español
    const separator = ';';

    const csvRows = [
      headers.join(separator),
      ...this.filteredComplaints.map(c => [
        c.codigoConfirmacion,
        this.formatDate(c.fecha),
        c.nombres,
        c.apellidoPaterno,
        c.apellidoMaterno,
        this.getDocumentTypeLabel(c.tipoDocumento),
        c.numeroDocumento,
        c.email,
        c.telefonoFijo || '-',
        c.telefonoCelular,
        // Envolvemos en comillas y limpiamos posibles puntos y coma internos para no romper columnas
        `"${c.direccion.replace(/"/g, '""')}"`,
        c.distrito,
        c.departamento,
        `"${c.detalleReclamo.replace(/"/g, '""')}"`
      ].join(separator))
    ];

    // Agregamos el BOM (Byte Order Mark) para que Excel detecte UTF-8 y muestre bien las tildes/eñes
    const csvContent = '\uFEFF' + csvRows.join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reclamos_odontpro_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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