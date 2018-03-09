import { FormGroup } from '@angular/forms';

export class TherapieValidator {
  static isValid(group: FormGroup): any {
    var phytoForm = group.controls.phytoForm.value;
    var boissonForm = group.controls.boissonForm.value;
    var aromaForm = group.controls.aromaForm.value;
    var vitamineForm = group.controls.vitamineForm.value;
    var homeoForm = group.controls.homeoForm.value;
    var aucunForm = group.controls.aucunForm.value;
    var autres = group.controls.autres.value;
    var autresForm = group.controls.autresForm.value;
    if (autres && autresForm==''){
      group.controls.autresForm.setErrors({"autres_empty": true});
    }
    if (!phytoForm && !boissonForm && !aromaForm && !vitamineForm && !homeoForm && !autres && !aucunForm){
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