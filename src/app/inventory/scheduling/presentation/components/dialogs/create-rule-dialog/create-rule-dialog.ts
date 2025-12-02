import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RuleType } from '../../../../domain/model/schedule-rule.entity';

interface RuleFormData {
    type: RuleType;
    name: string;
    description: string;
}

@Component({
    selector: 'app-create-rule-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './create-rule-dialog.html',
    styleUrl: './create-rule-dialog.css'
})
export class CreateRuleDialog {
    ruleTypes: { value: RuleType; label: string; description: string }[] = [
        {
            value: 'night_mode',
            label: 'Modo Nocturno',
            description: 'Apaga o reduce dispositivos automáticamente durante la noche'
        },
        {
            value: 'energy_saving',
            label: 'Ahorro de Energía',
            description: 'Optimiza el consumo apagando dispositivos innecesarios'
        },
        {
            value: 'away_mode',
            label: 'Modo Ausente',
            description: 'Apaga dispositivos cuando no hay nadie en casa'
        },
        {
            value: 'eco_mode',
            label: 'Modo Eco',
            description: 'Reduce el consumo al mínimo necesario'
        },
        {
            value: 'comfort_mode',
            label: 'Modo Confort',
            description: 'Ajusta dispositivos para máximo confort'
        }
    ];

    formData: RuleFormData = {
        type: 'night_mode',
        name: '',
        description: ''
    };

    constructor(
        public dialogRef: MatDialogRef<CreateRuleDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        // Initialize with first option
        this.onTypeChange();
    }

    onTypeChange(): void {
        const selectedType = this.ruleTypes.find(t => t.value === this.formData.type);
        if (selectedType) {
            // Always update when type changes
            this.formData.name = selectedType.label;
            this.formData.description = selectedType.description;
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onCreate(): void {
        if (this.isValid()) {
            this.dialogRef.close(this.formData);
        }
    }

    isValid(): boolean {
        return this.formData.name.trim().length > 0 &&
            this.formData.description.trim().length > 0;
    }
}
