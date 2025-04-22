import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { environment } from "../../../environments/environment";

export function translateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `http://localhost:5000/i18n/`, ".json");
}
