<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [css-es-modules](./css-es-modules.md) &gt; [injectStyles](./css-es-modules.injectstyles.md)

## injectStyles() function

Inject stylesheet to global on node or to the document DOM on the browser

<b>Signature:</b>

```typescript
export declare function injectStyles(stylesheetKey: string, stylesheetBody: string, options?: StylesInjectOptions, serverSide?: boolean, shadowRoot?: ShadowRoot): void;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  stylesheetKey | string | the unique stylesheet key |
|  stylesheetBody | string | the stylesheet body |
|  options | [StylesInjectOptions](./css-es-modules.stylesinjectoptions.md) | inject options |
|  serverSide | boolean | force server/client approach |
|  shadowRoot | ShadowRoot | optional shadow root where styles will be injected |

<b>Returns:</b>

void

