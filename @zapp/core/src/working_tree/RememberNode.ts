import { RememberedValue } from './effects/RememberedValue.js'
import { WorkingNode } from './WorkingNode.js'

export class RememberNode extends WorkingNode {
  public remembered: RememberedValue<any>
}
