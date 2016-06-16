"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var Validators_1 = require('services/Validators');
var SampleForm = (function () {
    function SampleForm(builder) {
        this.username = new core_1.Control("larry", core_1.Validators.required);
        this.email = new core_1.Control("", Validators_1.EmailValidator.email);
        this.form = builder.group({
            username: this.username,
            email: this.email
        });
    }
    SampleForm = __decorate([
        core_1.Component({
            selector: 'sample-form',
            viewBindings: [core_1.FormBuilder],
            templateUrl: './templates/sample-form.html',
            directives: [core_1.FORM_DIRECTIVES, core_1.CORE_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.FormBuilder !== 'undefined' && core_1.FormBuilder) === 'function' && _a) || Object])
    ], SampleForm);
    return SampleForm;
    var _a;
}());
function main() {
    core_1.bootstrap(SampleForm);
}
exports.main = main;
//# sourceMappingURL=form.js.map