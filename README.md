# Three.js Playground

A TypeScript React playground for learning and experimenting with Three.js and WebGL visualizations.

## Features

- ⚛️ **React 18** with TypeScript for modern component development
- 🎨 **Three.js** for 3D graphics and WebGL rendering
- 🔗 **React Three Fiber** for declarative Three.js in React
- 🛠️ **React Three Drei** for useful helpers and abstractions
- ⚡ **Vite** for fast development and building
- 🎛️ **Leva** for easy GUI controls (included but not yet used)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000` to see your Three.js playground!

## Project Structure

```
src/
├── components/     # Reusable React components
├── scenes/         # Three.js scenes and 3D components
├── utils/          # Utility functions and helpers
├── App.tsx         # Main application component
├── App.css         # Application styles
├── main.tsx        # React entry point
└── index.css       # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Learning Resources

### Three.js Fundamentals
- [Three.js Official Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [Discover Three.js Book](https://discoverthreejs.com/)

### React Three Fiber
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [React Three Drei Documentation](https://docs.pmnd.rs/drei/introduction)

### WebGL Concepts
- [WebGL Fundamentals](https://webglfundamentals.org/)
- [Learn OpenGL](https://learnopengl.com/) (concepts apply to WebGL)

## Current Examples

### Rotating Cube
- Basic mesh creation with geometry and material
- Animation using `useFrame` hook
- Lighting setup (ambient + directional)
- Camera controls with OrbitControls

## Next Steps

Here are some ideas for your next experiments:

1. **Add more geometry types:** spheres, cylinders, custom geometries
2. **Experiment with materials:** different material types, textures, shaders
3. **Add interactions:** mouse hover effects, click handlers
4. **Create animations:** more complex animations, timeline-based sequences
5. **Add GUI controls:** use Leva to control scene parameters in real-time
6. **Load 3D models:** import .gltf/.glb files
7. **Add post-processing effects:** bloom, depth of field, etc.
8. **Create particle systems:** stars, fire, smoke effects

## Tips for Beginners

1. **Start small:** Begin with basic shapes and gradually add complexity
2. **Use the browser developer tools:** The Three.js inspector can be very helpful
3. **Experiment with values:** Change numbers in the code to see what happens
4. **Read the documentation:** Three.js has excellent docs with examples
5. **Join the community:** Discord servers and forums are great for getting help

Happy coding! 🚀
