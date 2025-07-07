import Layout from "@/components/Layout";
import RichContentEditorDemo from "@/components/RichContentEditorDemo";

const RichEditor = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Rich Content Editor
            </h1>
            <p className="text-lg text-muted-foreground">
              Test the drag & drop image upload functionality with Firebase Storage integration.
              Create rich content with formatting, images, and automatic saving.
            </p>
          </div>
          
          <RichContentEditorDemo />
        </div>
      </div>
    </Layout>
  );
};

export default RichEditor;