import { RegisterSingleton } from "@entity-access/entity-access/dist/di/di.js";
import EntityContextEvents from "@entity-access/entity-access/dist/model/events/ContextEvents.js";

@RegisterSingleton
export default class AppContextEvents extends EntityContextEvents {


}