import { RegisterSingleton } from "@entity-access/entity-access/dist/di/di.js";
import WorkflowContext from "@entity-access/entity-access/dist/workflows/WorkflowContext.js";

@RegisterSingleton
export default class AppWorkflowContext extends WorkflowContext {

}