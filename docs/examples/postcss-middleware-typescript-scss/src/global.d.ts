// As we want to import the '*.scss' files within the typescript code, we need to provide this
// declaration to avoid compiler errors
declare module '*.scss' {
    type Styles = { [className: string]: string; } & { inject(): void; }
    export const styles: Styles;
    export const key: string;
    export const css: string;
    export default styles;
}
