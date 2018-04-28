import { FormGroup } from '@angular/forms';

export class TherapieValidator {
  static isValid(group: FormGroup): any {
    var phytoForm = group.controls.phytoForm.value;
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
    if (!phytoForm && !aromaForm && !vitamineForm && !homeoForm && !autresboolForm && !aucunForm && !inconnuForm){
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
    var typeboolForm = group.controls.typeboolForm.value;
    var organeboolForm = group.controls.organeboolForm.value;
    var nom_organeForm = group.controls.nom_organeForm.value;
    var etatForm = group.controls.etatForm.value;
    if (typeboolForm == 'non' || typeboolForm == 'je ne sais pas') {
      if (organeboolForm == '') {
        group.controls.organeboolForm.setErrors({"empty": true});
      } else if (organeboolForm =='oui'  && nom_organeForm=='') {
        group.controls.nom_organeForm.setErrors({"empty": true});
      }
      if (etatForm == ''){
        group.controls.etatForm.setErrors({"empty": true});
      }
    } else if (typeboolForm == 'oui' && nom_organeForm == '') {
      group.controls.nom_organeForm.setErrors({"empty": true});
      group.controls.organeboolForm.setErrors(null);
      group.controls.etatForm.setErrors(null);

    }
  }
}