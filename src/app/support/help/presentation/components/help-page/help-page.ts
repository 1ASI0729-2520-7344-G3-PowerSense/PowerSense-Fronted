import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQCategory {
    name: string;
    icon: string;
    items: FAQItem[];
}

interface Guide {
    module: string;
    icon: string;
    color: string;
    steps: string[];
}

interface Tip {
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    icon: string;
}

interface TipCategory {
    name: string;
    tips: Tip[];
}

interface GlossaryTerm {
    term: string;
    definition: string;
    example?: string;
}

@Component({
    selector: 'app-help-page',
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        MatIconModule,
        MatCardModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormsModule
    ],
    templateUrl: './help-page.html',
    styleUrl: './help-page.css'
})
export class HelpPage {
    // Estado del formulario de contacto
    contactForm = {
        name: '',
        email: '',
        subject: '',
        message: ''
    };

    // FAQ Data
    readonly faqCategories: FAQCategory[] = [
        {
            name: 'General',
            icon: 'help_outline',
            items: [
                {
                    question: '¿Qué es PowerSense?',
                    answer: 'PowerSense es un sistema de gestión inteligente de energía que te permite monitorear, controlar y optimizar el consumo eléctrico de tus dispositivos en tiempo real.'
                },
                {
                    question: '¿Cómo funciona el monitoreo en tiempo real?',
                    answer: 'El sistema recopila datos de consumo de tus dispositivos cada segundo y los procesa para mostrarte información actualizada sobre tu consumo energético.'
                },
                {
                    question: '¿Puedo exportar mis datos?',
                    answer: 'Sí, puedes exportar reportes en formato PDF o Excel desde la sección de Reportes.'
                }
            ]
        },
        {
            name: 'Dispositivos',
            icon: 'devices',
            items: [
                {
                    question: '¿Cómo agrego un nuevo dispositivo?',
                    answer: 'Ve a la sección Dispositivos, haz clic en "Agregar Dispositivo", completa el formulario con el nombre, tipo, ubicación y consumo estimado, y guarda.'
                },
                {
                    question: '¿Por qué mi dispositivo aparece como inactivo?',
                    answer: 'Un dispositivo inactivo significa que está apagado o no está consumiendo energía. Verifica que esté encendido y correctamente conectado.'
                },
                {
                    question: '¿Puedo editar la información de un dispositivo?',
                    answer: 'Sí, haz clic en el ícono de edición en la tarjeta del dispositivo para modificar su información.'
                },
                {
                    question: '¿Cómo elimino un dispositivo?',
                    answer: 'Haz clic en el ícono de eliminar en la tarjeta del dispositivo. Esta acción no se puede deshacer.'
                }
            ]
        },
        {
            name: 'Programación',
            icon: 'schedule',
            items: [
                {
                    question: '¿Cómo creo un horario automático?',
                    answer: 'Ve a Programación, haz clic en "Nuevo Horario", selecciona el dispositivo, define los días y horas de encendido/apagado, y guarda.'
                },
                {
                    question: '¿Qué es la programación rápida?',
                    answer: 'Es una función que te permite crear horarios predefinidos comunes (ej: "Lunes a Viernes 8AM-6PM") con un solo clic.'
                },
                {
                    question: '¿Puedo tener múltiples horarios para el mismo dispositivo?',
                    answer: 'Sí, pero asegúrate de que no se solapen para evitar conflictos.'
                },
                {
                    question: '¿Qué pasa si hay un conflicto de horarios?',
                    answer: 'El sistema te alertará y priorizará el horario más reciente. Puedes resolver conflictos desde la sección de Alertas.'
                }
            ]
        },
        {
            name: 'Alertas',
            icon: 'notifications',
            items: [
                {
                    question: '¿Qué tipos de alertas existen?',
                    answer: 'Hay alertas dinámicas (generadas automáticamente por el sistema) y alertas configurables (creadas por ti con umbrales personalizados).'
                },
                {
                    question: '¿Cómo creo una alerta personalizada?',
                    answer: 'Ve a Alertas, haz clic en "Nueva Alerta", selecciona el tipo, severidad, dispositivo (opcional), umbral y mensaje.'
                },
                {
                    question: '¿Qué significa reconocer una alerta?',
                    answer: 'Marcar una alerta como reconocida indica que ya la viste y tomaste acción. Las alertas reconocidas se archivan automáticamente.'
                }
            ]
        },
        {
            name: 'Reportes',
            icon: 'assessment',
            items: [
                {
                    question: '¿Cómo genero un reporte?',
                    answer: 'Ve a Reportes, selecciona el período de tiempo, los dispositivos o salas que deseas incluir, y haz clic en "Generar Reporte".'
                },
                {
                    question: '¿Puedo comparar períodos?',
                    answer: 'Sí, usa la opción de comparación para ver el consumo actual vs períodos anteriores.'
                },
                {
                    question: '¿Qué formatos de exportación están disponibles?',
                    answer: 'Puedes exportar en PDF (para presentaciones) o Excel (para análisis detallado).'
                }
            ]
        }
    ];

    // Guides Data
    readonly guides: Guide[] = [
        {
            module: 'Dispositivos',
            icon: 'devices',
            color: '#4A90E2',
            steps: [
                'Haz clic en "Agregar Dispositivo" en la esquina superior derecha',
                'Completa el formulario: nombre, tipo, ubicación y consumo estimado',
                'Guarda el dispositivo',
                'El dispositivo aparecerá en tu lista y comenzará a monitorearse',
                'Puedes editarlo o eliminarlo en cualquier momento desde su tarjeta'
            ]
        },
        {
            module: 'Programación',
            icon: 'schedule',
            color: '#28A745',
            steps: [
                'Ve a la sección Programación',
                'Haz clic en "Nuevo Horario"',
                'Selecciona el dispositivo que deseas programar',
                'Define los días de la semana (puedes seleccionar múltiples)',
                'Establece las horas de encendido y apagado',
                'Opcionalmente, agrega una descripción',
                'Guarda el horario',
                'El sistema ejecutará automáticamente el horario según lo configurado'
            ]
        },
        {
            module: 'Alertas',
            icon: 'notifications',
            color: '#F2C94C',
            steps: [
                'Accede a la sección Alertas',
                'Haz clic en "Nueva Alerta"',
                'Selecciona el tipo de alerta (Alto Consumo, Dispositivo Offline, etc.)',
                'Define la severidad (Info, Advertencia, Error, Crítico)',
                'Opcionalmente, asocia un dispositivo específico',
                'Establece un umbral si aplica (ej: 1000W)',
                'Escribe un mensaje descriptivo',
                'Guarda la alerta',
                'Recibirás notificaciones cuando se active'
            ]
        },
        {
            module: 'Reportes',
            icon: 'assessment',
            color: '#BB6BD9',
            steps: [
                'Ve a la sección Reportes',
                'Selecciona el tipo de reporte (Consumo, Costos, Eficiencia)',
                'Define el período de tiempo (día, semana, mes, personalizado)',
                'Filtra por dispositivos o salas si lo deseas',
                'Haz clic en "Generar Reporte"',
                'Revisa los gráficos y estadísticas',
                'Exporta en PDF o Excel si necesitas compartirlo'
            ]
        }
    ];

    // Tips Data
    readonly tipCategories: TipCategory[] = [
        {
            name: 'Iluminación',
            tips: [
                {
                    title: 'Usa bombillas LED',
                    description: 'Las bombillas LED consumen hasta 80% menos energía que las incandescentes y duran mucho más tiempo.',
                    impact: 'high',
                    icon: 'lightbulb'
                },
                {
                    title: 'Aprovecha la luz natural',
                    description: 'Abre cortinas y persianas durante el día para reducir el uso de luz artificial.',
                    impact: 'medium',
                    icon: 'wb_sunny'
                },
                {
                    title: 'Apaga las luces al salir',
                    description: 'Crea el hábito de apagar las luces en habitaciones vacías.',
                    impact: 'medium',
                    icon: 'power_settings_new'
                }
            ]
        },
        {
            name: 'Climatización',
            tips: [
                {
                    title: 'Temperatura óptima',
                    description: 'Mantén el aire acondicionado a 24°C en verano y la calefacción a 20°C en invierno.',
                    impact: 'high',
                    icon: 'thermostat'
                },
                {
                    title: 'Limpia los filtros',
                    description: 'Limpia los filtros del AC cada mes para mantener su eficiencia.',
                    impact: 'medium',
                    icon: 'cleaning_services'
                },
                {
                    title: 'Cierra puertas y ventanas',
                    description: 'Asegúrate de que puertas y ventanas estén cerradas cuando uses climatización.',
                    impact: 'high',
                    icon: 'door_front'
                }
            ]
        },
        {
            name: 'Electrodomésticos',
            tips: [
                {
                    title: 'Desconecta dispositivos en standby',
                    description: 'Los dispositivos en standby pueden consumir hasta 10% de tu factura eléctrica.',
                    impact: 'medium',
                    icon: 'power_off'
                },
                {
                    title: 'Usa lavadora con carga completa',
                    description: 'Espera a tener carga completa antes de usar la lavadora o lavavajillas.',
                    impact: 'medium',
                    icon: 'local_laundry_service'
                },
                {
                    title: 'Refrigerador eficiente',
                    description: 'Mantén el refrigerador a 4°C y el congelador a -18°C. No lo sobrecargues.',
                    impact: 'high',
                    icon: 'kitchen'
                }
            ]
        },
        {
            name: 'Hábitos',
            tips: [
                {
                    title: 'Programa tus dispositivos',
                    description: 'Usa la función de programación para automatizar el encendido/apagado de dispositivos.',
                    impact: 'high',
                    icon: 'schedule'
                },
                {
                    title: 'Monitorea tu consumo',
                    description: 'Revisa regularmente el dashboard para identificar picos de consumo.',
                    impact: 'medium',
                    icon: 'insights'
                },
                {
                    title: 'Educa a tu familia',
                    description: 'Comparte estos consejos con todos en casa para multiplicar el ahorro.',
                    impact: 'high',
                    icon: 'family_restroom'
                }
            ]
        },
        {
            name: 'Mantenimiento',
            tips: [
                {
                    title: 'Revisa conexiones',
                    description: 'Verifica que los cables y enchufes estén en buen estado para evitar pérdidas de energía.',
                    impact: 'medium',
                    icon: 'cable'
                },
                {
                    title: 'Actualiza equipos viejos',
                    description: 'Los electrodomésticos modernos son mucho más eficientes energéticamente.',
                    impact: 'high',
                    icon: 'update'
                },
                {
                    title: 'Aísla tu hogar',
                    description: 'Un buen aislamiento térmico reduce significativamente el consumo de climatización.',
                    impact: 'high',
                    icon: 'home'
                }
            ]
        }
    ];

    // Glossary Data
    readonly glossaryTerms: GlossaryTerm[] = [
        {
            term: 'kWh (Kilovatio-hora)',
            definition: 'Unidad de energía que equivale al consumo de 1000 watts durante 1 hora.',
            example: 'Si un dispositivo de 100W funciona durante 10 horas, consume 1 kWh.'
        },
        {
            term: 'Watts (W)',
            definition: 'Unidad de potencia que mide la tasa de consumo de energía en un momento dado.',
            example: 'Una bombilla LED típica consume 10W, mientras que una incandescente consume 60W.'
        },
        {
            term: 'Consumo',
            definition: 'Cantidad total de energía eléctrica utilizada en un período de tiempo.',
            example: 'El consumo mensual de una casa promedio es de 300-400 kWh.'
        },
        {
            term: 'Eficiencia Energética',
            definition: 'Relación entre la energía útil obtenida y la energía total consumida.',
            example: 'Un dispositivo con 90% de eficiencia aprovecha 90% de la energía y desperdicia 10%.'
        },
        {
            term: 'Factor de Potencia',
            definition: 'Medida de qué tan efectivamente se utiliza la energía eléctrica.',
            example: 'Un factor de potencia de 1.0 es ideal, valores menores indican desperdicio.'
        },
        {
            term: 'Tarifa',
            definition: 'Precio que se paga por cada kWh consumido, puede variar según la hora del día.',
            example: 'Tarifa pico: $0.20/kWh, Tarifa valle: $0.10/kWh.'
        },
        {
            term: 'Demanda',
            definition: 'Potencia máxima requerida en un momento específico, medida en kW.',
            example: 'La demanda máxima de una casa puede ser 5 kW cuando todos los dispositivos están encendidos.'
        },
        {
            term: 'Carga Base',
            definition: 'Consumo mínimo constante de energía, incluso cuando no se usan dispositivos activamente.',
            example: 'Refrigerador, router, relojes digitales contribuyen a la carga base.'
        },
        {
            term: 'Pico de Consumo',
            definition: 'Momento del día con mayor demanda de energía, generalmente mañana y noche.',
            example: 'El pico de consumo suele ser entre 6-9 PM cuando todos llegan a casa.'
        },
        {
            term: 'Smart Meter',
            definition: 'Medidor inteligente que registra el consumo en tiempo real y lo transmite digitalmente.',
            example: 'PowerSense se integra con smart meters para obtener datos precisos.'
        }
    ];

    // Métodos
    getImpactColor(impact: string): string {
        switch (impact) {
            case 'high': return '#28A745';
            case 'medium': return '#F2C94C';
            case 'low': return '#4A90E2';
            default: return '#8A8A8A';
        }
    }

    getImpactLabel(impact: string): string {
        switch (impact) {
            case 'high': return 'Alto Impacto';
            case 'medium': return 'Impacto Medio';
            case 'low': return 'Bajo Impacto';
            default: return '';
        }
    }

    submitContact(): void {
        if (this.contactForm.name && this.contactForm.email && this.contactForm.message) {
            console.log('Formulario enviado:', this.contactForm);
            alert('¡Gracias por contactarnos! Te responderemos pronto.');
            // Reset form
            this.contactForm = { name: '', email: '', subject: '', message: '' };
        }
    }
}
