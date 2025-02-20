import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./layouts";
import { Schemas } from "./pages/Schemas/Schemas";
import { MyArea } from "./pages/MyArea/MyArea";
import { SchemaDetailScreen } from "./pages/SchemaDetails/schema-details.screen";
import { AttestationDetails } from "./pages/attestation-details/attestation-details.screen";
import { Attestations } from "./pages/Attestations/Attestations";

export const routerConfig = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Schemas />,
        errorElement: <h1>404 Not Found</h1>,
      },
      {
        path: "/schema/view/:schemaId",
        element: <SchemaDetailScreen />,
        errorElement: <h1>404 Not Found</h1>,
      },
      {
        path: "/attestation/view/:attestationId",
        element: <AttestationDetails />,
      },
      {
        path: "/attestations",
        element: <Attestations />,
      },
      {
        path: "/myarea",
        element: <MyArea />,
        errorElement: <h1>404 Not Found</h1>,
      },
    ],
  },
]);
