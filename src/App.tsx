import { createRoot } from 'react-dom/client';
import { AppSidebar } from './app-components/app-sidebar';
import Wrapper from './app-components/Wrapper';
import Page from './views/page';

const root = createRoot(document.body);
root.render(<Page />);