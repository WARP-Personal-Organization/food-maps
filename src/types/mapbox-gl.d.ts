declare module 'mapbox-gl' {
  export interface MapboxOptions {
    container: HTMLElement | string;
    style?: string;
    center?: [number, number];
    zoom?: number;
    bearing?: number;
    pitch?: number;
    minZoom?: number;
    maxZoom?: number;
    interactive?: boolean;
    attributionControl?: boolean;
    customAttribution?: string | string[];
    logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    renderWorldCopies?: boolean;
    maxBounds?: LngLatBoundsLike;
    scrollZoom?: boolean;
    boxZoom?: boolean;
    dragRotate?: boolean;
    dragPan?: boolean;
    keyboard?: boolean;
    doubleClickZoom?: boolean;
    touchZoomRotate?: boolean;
    trackResize?: boolean;
    projection?: { name: string } | string;
    transformRequest?: (
      url: string,
      resourceType: string
    ) => {
      url: string;
      headers?: { [key: string]: string };
      credentials?: string;
    };
  }

  export class Map {
    constructor(options: MapboxOptions);
    addControl(
      control: Control,
      position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    ): this;
    removeControl(control: Control): this;
    resize(): this;
    getContainer(): HTMLElement;
    getCanvas(): HTMLCanvasElement;
    getCanvasContainer(): HTMLElement;
    getStyle(): any;
    setStyle(style: string | any): this;
    isStyleLoaded(): boolean;
    addSource(id: string, source: any): this;
    removeSource(id: string): this;
    getSource(id: string): any;
    addLayer(layer: any, before?: string): this;
    removeLayer(id: string): this;
    getLayer(id: string): any;
    setFilter(layerId: string, filter: any): this;
    setPaintProperty(layerId: string, name: string, value: any): this;
    setLayoutProperty(layerId: string, name: string, value: any): this;
    getCenter(): LngLat;
    setCenter(center: LngLatLike): this;
    getZoom(): number;
    setZoom(zoom: number): this;
    getBearing(): number;
    setBearing(bearing: number): this;
    getPitch(): number;
    setPitch(pitch: number): this;
    getBounds(): LngLatBounds;
    setBounds(
      bounds: LngLatBoundsLike,
      options?: {
        padding?:
          | number
          | { top: number; bottom: number; left: number; right: number };
      }
    ): this;
    fitBounds(
      bounds: LngLatBoundsLike,
      options?: {
        padding?:
          | number
          | { top: number; bottom: number; left: number; right: number };
        maxZoom?: number;
      }
    ): this;
    flyTo(options: {
      center?: LngLatLike;
      zoom?: number;
      bearing?: number;
      pitch?: number;
    }): this;
    easeTo(options: {
      center?: LngLatLike;
      zoom?: number;
      bearing?: number;
      pitch?: number;
    }): this;
    jumpTo(options: {
      center?: LngLatLike;
      zoom?: number;
      bearing?: number;
      pitch?: number;
    }): this;
    getProjection(): { name: string };
    setProjection(projection: { name: string } | string): this;
    hasImage(id: string): boolean;
    addImage(
      id: string,
      image:
        | HTMLImageElement
        | ImageData
        | ImageBitmap
        | {
            width: number;
            height: number;
            data: Uint8Array | Uint8ClampedArray;
          },
      options?: { pixelRatio?: number; sdf?: boolean }
    ): this;
    on(type: string, listener: (e?: any) => void): this;
    off(type: string, listener: (e?: any) => void): this;
    once(type: string, listener: (e?: any) => void): this;
    remove(): void;
  }

  export class Marker {
    constructor(options?: {
      element?: HTMLElement;
      offset?: [number, number];
      anchor?: string;
      color?: string;
      draggable?: boolean;
      rotation?: number;
      rotationAlignment?: string;
      pitchAlignment?: string;
    });
    setLngLat(lngLat: LngLatLike): this;
    getLngLat(): LngLat;
    addTo(map: Map): this;
    remove(): this;
    getElement(): HTMLElement;
    setPopup(popup: Popup): this;
    getPopup(): Popup;
    togglePopup(): this;
    setOffset(offset: [number, number]): this;
    setDraggable(draggable: boolean): this;
    setRotation(rotation: number): this;
    getRotation(): number;
    setRotationAlignment(alignment: string): this;
    setPitchAlignment(alignment: string): this;
  }

  export class Popup {
    constructor(options?: {
      closeButton?: boolean;
      closeOnClick?: boolean;
      anchor?: string;
      offset?: number | [number, number] | { [key: string]: [number, number] };
      className?: string;
      maxWidth?: string;
    });
    setLngLat(lngLat: LngLatLike): this;
    getLngLat(): LngLat;
    addTo(map: Map): this;
    remove(): this;
    setHTML(html: string): this;
    setText(text: string): this;
    setMaxWidth(maxWidth: string): this;
    isOpen(): boolean;
  }

  export class NavigationControl implements Control {
    constructor(options?: {
      showCompass?: boolean;
      showZoom?: boolean;
      visualizePitch?: boolean;
    });
    onAdd(map: Map): HTMLElement;
    onRemove(map: Map): void;
  }

  export class AttributionControl implements Control {
    constructor(options?: {
      compact?: boolean;
      customAttribution?: string | string[];
    });
    onAdd(map: Map): HTMLElement;
    onRemove(map: Map): void;
  }

  export interface Control {
    onAdd(map: Map): HTMLElement;
    onRemove(map: Map): void;
  }

  export class LngLat {
    constructor(lng: number, lat: number);
    lng: number;
    lat: number;
    wrap(): LngLat;
    toArray(): [number, number];
    toString(): string;
    distanceTo(lngLat: LngLat): number;
    toBounds(radius: number): LngLatBounds;
  }

  export class LngLatBounds {
    constructor(sw?: LngLatLike, ne?: LngLatLike);
    setNorthEast(ne: LngLatLike): this;
    setSouthWest(sw: LngLatLike): this;
    extend(obj: LngLatLike | LngLatBoundsLike): this;
    getCenter(): LngLat;
    getSouthWest(): LngLat;
    getNorthEast(): LngLat;
    getNorth(): number;
    getSouth(): number;
    getEast(): number;
    getWest(): number;
    toArray(): [[number, number], [number, number]];
    toString(): string;
    isEmpty(): boolean;
    contains(lngLat: LngLatLike): boolean;
  }

  export type LngLatLike =
    | LngLat
    | { lng: number; lat: number }
    | { lon: number; lat: number }
    | [number, number];
  export type LngLatBoundsLike =
    | LngLatBounds
    | [LngLatLike, LngLatLike]
    | [number, number, number, number];

  export let accessToken: string;
}
