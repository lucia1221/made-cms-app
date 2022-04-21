import { databaseService } from "./databaseService.server";

export function storageService() {
    return databaseService().storage;
}
