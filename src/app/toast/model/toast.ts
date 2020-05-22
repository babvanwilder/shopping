import { IToast } from '../interface/toast';

export class Toast implements IToast {

  constructor(public title: string, public content: string) { }
}
