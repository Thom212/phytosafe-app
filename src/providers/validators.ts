import { FormGroup } from '@angular/forms';

export class TherapieValidator {
  static isValid(group: FormGroup): any {
    var phytoForm = group.controls.phytoForm.value;
    var boissonForm = group.controls.boissonForm.value;
    var aromaForm = group.controls.aromaForm.value;
    var vitamineForm = group.controls.vitamineForm.value;
    var homeoForm = group.controls.homeoForm.value;
    var aucunForm = group.controls.aucunForm.value;
    var inconnuForm = group.controls.inconnuForm.value;
    var autresboolForm = group.controls.autresboolForm.value;
    var autresForm = group.controls.autresForm.value;
    if (autresboolForm && autresForm==''){
      group.controls.autresForm.setErrors({"autres_empty": true});
    }
    if (!phytoForm && !boissonForm && !aromaForm && !vitamineForm && !homeoForm && !autresboolForm && !aucunForm && !inconnuForm){
      return {
          "empty": true
      };
    } else {
      return null;
    }
  }
}

export class TabacValidator {
  static isValid(group: FormGroup): any {
    var tabacForm = group.controls.tabacForm.value;
    var frequenceForm = group.controls.frequenceForm.value;
    if (tabacForm=='oui' && frequenceForm==''){
      group.controls.frequenceForm.setErrors({"empty": true});
    }
  }
}

export class MaladieValidator {
  static isValid(group: FormGroup): any {
    var organeboolForm = group.controls.organeboolForm.value;
    var nom_organeForm = group.controls.nom_organeForm.value;
    //TODO || organeboolForm=='hemato'
    if (organeboolForm=='oui'  && nom_organeForm==''){
      group.controls.nom_organeForm.setErrors({"empty": true});
    }
  }
}