# Food Maps

A food mapping application built with Next.js and Mapbox GL JS.

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up your Mapbox access token:
   - Sign up for a Mapbox account at https://account.mapbox.com
   - Create an access token in your Mapbox account
   - Copy the token to your `.env.local` file:

```
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Using the Map Component

The `FoodMapRenderer` can be used in your pages as follows:

```tsx
import FoodMapRenderer from '../components/FoodMapRenderer';

// Example locations
const locations = [
  {
    name: 'Restaurant A',
    x: 10.5, // x-coordinate
    y: 15.2, // y-coordinate
    description: 'A great restaurant to visit',
    iconType: 'restaurant',
  },
  {
    name: 'Shop B',
    x: 10.52,
    y: 15.22,
    description: 'An awesome shop',
    iconType: 'shop',
  },
];

// Example component usage
export default function MyPage() {
  const handleLocationClick = (location) => {
    console.log('Location clicked:', location.name);
  };

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <FoodMapRenderer
        locations={locations}
        mapBounds={[
          [15.1, 10.4], // [minY, minX]
          [15.3, 10.6], // [maxY, maxX]
        ]}
        defaultZoom={12}
        onLocationClick={handleLocationClick}
        mapStyle="mapbox://styles/mapbox/streets-v12" // Optional custom style
      />
    </div>
  );
}
```

## Using a Custom SVG Map

The `FoodMapRenderer` also supports displaying a custom SVG map image as an overlay. This is useful when you want to use your own map design or a stylized map:

```tsx
<FoodMapRenderer
  locations={locations}
  mapBounds={mapBounds}
  mapImageUrl="/path/to/your/map.svg" // Path to your SVG map in the public folder
  useCustomMap={true} // Enable the custom map overlay
  defaultZoom={12}
  onLocationClick={handleLocationClick}
/>
```

When `useCustomMap` is set to `true`, the component will:

1. Use an empty Mapbox style as the base
2. Load your custom SVG map as an overlay
3. Position the map according to the provided `mapBounds`
4. Place markers on top of your custom map

This allows you to use your own custom-designed maps while still taking advantage of Mapbox's features for handling markers, popups, and interactions.

## Coordinate System

The FoodMapRenderer uses a custom coordinate system that is converted to Mapbox's longitude/latitude system. When you provide `x` and `y` coordinates:

- `x` coordinates are mapped to longitude values (must be between -180 and 180 in the real world)
- `y` coordinates are mapped to latitude values (must be between -90 and 90 in the real world)

The component automatically converts your custom x,y coordinates to valid Mapbox coordinates based on the `mapBounds` parameter. This allows you to use any coordinate system you prefer for your application.

### Important Notes About Coordinates

1. The `mapBounds` prop defines the boundaries of your custom coordinate system: `[[minY, minX], [maxY, maxX]]`
2. All location coordinates (x, y) should fall within these bounds
3. The component will automatically scale your coordinates to appropriate longitude/latitude values

## Mapbox Styles

You can use different map styles by specifying the `mapStyle` prop:

- Streets: `mapbox://styles/mapbox/streets-v12`
- Outdoors: `mapbox://styles/mapbox/outdoors-v12`
- Light: `mapbox://styles/mapbox/light-v11`
- Dark: `mapbox://styles/mapbox/dark-v11`
- Satellite: `mapbox://styles/mapbox/satellite-v9`
- Satellite Streets: `mapbox://styles/mapbox/satellite-streets-v12`

## FoodMapRenderer Props

| Prop              | Type                                   | Description                                                      |
| ----------------- | -------------------------------------- | ---------------------------------------------------------------- |
| `locations`       | `Location[]`                           | Array of locations to display on the map                         |
| `mapBounds`       | `[[number, number], [number, number]]` | Bounds of the map in [y, x] format: [[minY, minX], [maxY, maxX]] |
| `defaultZoom`     | `number`                               | Default zoom level (optional)                                    |
| `onLocationClick` | `(location: Location) => void`         | Callback for location clicks (optional)                          |
| `mapboxToken`     | `string`                               | Mapbox access token (optional, defaults to env variable)         |
| `mapStyle`        | `string`                               | Mapbox style URL (optional)                                      |
| `mapImageUrl`     | `string`                               | URL to the custom map image (optional)                           |
| `useCustomMap`    | `boolean`                              | Whether to use a custom map image (optional, default: false)     |

## License

[MIT](LICENSE)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
