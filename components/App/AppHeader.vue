<template>
  <header mx-auto flex items-center justify-between p-4 container>
    <slot name="left" />
    <div color-gray-500 space-x-2 dark:color-gray-400 md:space-x-4>
      <AppNavButton to="/posts">
        Blog
      </AppNavButton>
      <AppNavButton to="/projects">
        Projects
      </AppNavButton>
      <AppNavButton to="/guestbook">
        Guestbook
      </AppNavButton>
      <AppColorSwitcher />
    </div>
  </header>
</template>
