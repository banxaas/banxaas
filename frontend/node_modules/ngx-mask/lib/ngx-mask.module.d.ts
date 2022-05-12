import { ModuleWithProviders } from '@angular/core';
import { optionsConfig } from './config';
import * as i0 from "@angular/core";
import * as i1 from "./mask.directive";
import * as i2 from "./mask.pipe";
/**
 * @internal
 */
export declare function _configFactory(initConfig: optionsConfig, configValue: optionsConfig | (() => optionsConfig)): optionsConfig;
export declare class NgxMaskModule {
    static forRoot(configValue?: optionsConfig | (() => optionsConfig)): ModuleWithProviders<NgxMaskModule>;
    static forChild(): ModuleWithProviders<NgxMaskModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxMaskModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<NgxMaskModule, [typeof i1.MaskDirective, typeof i2.MaskPipe], never, [typeof i1.MaskDirective, typeof i2.MaskPipe]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<NgxMaskModule>;
}
