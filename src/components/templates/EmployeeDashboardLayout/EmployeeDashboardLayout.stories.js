import DashboardLayout from './EmployeeDashboardLayout.vue';

export default {
  title: 'Templates/DashboardLayout',
  component: DashboardLayout,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  render: (args) => ({
    components: { DashboardLayout },
    template: `
      <DashboardLayout>
        <template #sidebar>
          <div style="background: #2c3e50; height: 100%; color: white; padding: 20px;">Sidebar Placeholder</div>
        </template>
        <template #header-actions>
          <div style="background: white; border: 1px dashed #ccc; padding: 10px; width: 300px;">Header Actions Placeholder</div>
        </template>
        <template #content>
          <div style="background: white; border: 1px solid #ddd; height: 500px; padding: 40px; border-radius: 8px;">
            Main Content Area (Table, Forms, etc.)
          </div>
        </template>
      </DashboardLayout>
    `,
  }),
};