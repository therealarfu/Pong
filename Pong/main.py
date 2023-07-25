import pygame, sys
from random import choice

pygame.init()
clock = pygame.time.Clock()
screen_width, screen_height = 1000, 800
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption("Pong")
pygame.display.set_icon(pygame.image.load('icon/icon.png'))

player = pygame.Rect(screen_width - 20, screen_height / 2 - 70, 20, 140)
player2 = pygame.Rect(10, screen_height / 2 - 70, 20, 140)
ball = pygame.Rect(screen_width / 2 - 15, screen_height / 2 - 15, 30, 30)

entities = (242, 242, 242)
bg_color = (30, 30, 30)
screen.fill(bg_color)

p1Spd, p2Spd = 0, 410
bspdX = bspdY = 390 * choice((1, -1))

p1Score = p2Score = 0
game_font = pygame.font.SysFont('Consolas', 32)

scoreTimer = None
last_time = pygame.time.get_ticks()

def updatePlayer():
    player.y += p1Spd * dt
    if player.top <= 0:
        player.top = 0
    elif player.bottom >= screen_height:
        player.bottom = screen_height

def updateBall():
    global bspdX, bspdY, p1Score, p2Score,scoreTimer
    ball.x += bspdX * dt
    ball.y += bspdY * dt

    if ball.top <= 0 or ball.bottom >= screen_height:
        bspdY = -bspdY

    if ball.left <= 0:
        p1Score += 1
        bspdX = -bspdX
        scoreTimer = pygame.time.get_ticks()
    elif ball.right >= screen_width:
        p2Score += 1
        bspdX = -bspdX
        scoreTimer = pygame.time.get_ticks()

    if ball.colliderect(player) and bspdX > 0:
        if abs(ball.right - player.left) < 10:
            bspdX *= -1
        elif abs(ball.bottom - player.top) < 10 and bspdY > 0:
            bspdY *= -1
        elif abs(ball.top - player.bottom) < 10 and bspdY < 0:
            bspdY *= -1

    if ball.colliderect(player2) and bspdX < 0:
        if abs(ball.right - player2.right) < 10:
            bspdX *= -1
        elif abs(ball.bottom - player2.top) < 10 and bspdY > 0:
            bspdY *= -1
        elif abs(ball.top - player2.bottom) < 10 and bspdY < 0:
            bspdY *= -1
            
def updatePlayer2():
    if scoreTimer != None: return

    if player2.top < ball.y:
        player2.top += p2Spd * dt
    if player2.bottom > ball.y:
        player2.bottom -= p2Spd * dt
    if player2.top <= 0:
        player2.top = 0
    if player2.bottom >= screen_height:
        player2.bottom = screen_height

def restart():
    global bspdX, bspdY, scoreTimer
    
    current_time = pygame.time.get_ticks()
    ball.center = (screen_width / 2, screen_height / 2)

    if current_time - scoreTimer < 2100:
        bspdX, bspdY = 0,0
    else:
        bspdY =  390 * choice((1, -1))
        bspdX = 390 * choice((1, -1))
        scoreTimer = None
        
while True:
    current_time = pygame.time.get_ticks()
    dt = (current_time - last_time) / 1000.0
    last_time = current_time

    clock.tick(60)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_DOWN:
                p1Spd += 400
            if event.key == pygame.K_UP:
                p1Spd -= 400
        if event.type == pygame.KEYUP:
            if event.key == pygame.K_DOWN:
                p1Spd -= 400
            if event.key == pygame.K_UP:
                p1Spd += 400


    updatePlayer()
    updateBall()
    updatePlayer2()

    pygame.draw.rect(screen, entities, player)
    pygame.draw.rect(screen, entities, player2)
    pygame.draw.rect(screen, entities, ball)
    pygame.draw.aaline(screen, entities, (screen_width / 2, 0), (screen_width / 2, screen_height))

    player_text = game_font.render(f'{p1Score}', False, entities)
    player2_text = game_font.render(f'{p2Score}', False, entities)
    screen.blit(player_text,(530,400))
    screen.blit(player2_text, (440, 400))

    if scoreTimer:
        restart()
        
    pygame.display.flip()
    screen.fill(bg_color)